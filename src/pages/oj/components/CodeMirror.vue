<template>
  <div style="margin: 0px 0px 15px 0px">
    <Row type="flex" justify="space-between" class="header">
      <Col :span=12>
      <div>
        <span>Language:</span>
        <Select :value="language" @on-change="onLangChange" class="adjust">
          <Option v-for="item in languages" :key="item" :value="item">{{item}}
          </Option>
        </Select>

        <Tooltip content="Reset to default code definition" placement="top" style="margin-left: 10px">
          <Button icon="refresh" size="large" @click="onResetClick"></Button>
        </Tooltip>

        <Tooltip content="Upload file" placement="top" style="margin-left: 10px">
          <Button icon="upload" size="large" @click="onUploadFile"></Button>
        </Tooltip>

        <Tooltip content="Full screen" placement="top" style="margin-left: 10px">
          <Button icon="arrow-resize" size="large" @click="onFullScreen"></Button>
        </Tooltip>


        <input type="file" id="file-uploader" style="display: none" @change="onUploadFileDone">

      </div>
      </Col>
      <Col :span=12>
      <div class="fl-right">
        <span>Theme:</span>
        <Select :value="theme" @on-change="onThemeChange" class="adjust">
          <Option v-for="item in themes" :key="item.label" :value="item.value">{{item.label}}
          </Option>
        </Select>
      </div>
      </Col>
    </Row>
    <codemirror :value="value" :options="options" @change="onEditorCodeChange" ref="myEditor">
    </codemirror>
  </div>
</template>
<script>
  import utils from '@/utils/utils'
  import { codemirror, CodeMirror } from 'vue-codemirror-lite'

  // theme
  import 'codemirror/theme/monokai.css'
  import 'codemirror/theme/solarized.css'
  import 'codemirror/theme/material.css'

  // mode
  import 'codemirror/mode/clike/clike.js'
  import 'codemirror/mode/python/python.js'

  // active-line.js
  import 'codemirror/addon/selection/active-line.js'

  // foldGutter
  import 'codemirror/addon/fold/foldgutter.css'
  import 'codemirror/addon/fold/foldgutter.js'
  import 'codemirror/addon/fold/brace-fold.js'
  import 'codemirror/addon/fold/indent-fold.js'

  // 代码提示
  import 'codemirror/addon/hint/show-hint.js'
  import 'codemirror/addon/hint/show-hint.css'
  import 'codemirror/addon/hint/anyword-hint.js'
  import 'codemirror/addon/hint/javascript-hint.js'

  // 括号匹配
  import 'codemirror/addon/edit/matchbrackets.js'

  // 自动补全括号
  import 'codemirror/addon/edit/closebrackets.js'

  // 关键词高亮
  import 'codemirror/addon/scroll/annotatescrollbar'
  import 'codemirror/addon/search/matchesonscrollbar'
  import 'codemirror/addon/search/matchesonscrollbar.css'
  import 'codemirror/addon/search/match-highlighter'

  // F11全屏显示
  import 'codemirror/addon/display/fullscreen.js'
  import 'codemirror/addon/display/fullscreen.css'
  import 'codemirror/addon/comment/continuecomment'

  import langKeyWords from './langKeywords/keywords'

  var modeKeyWords = ''

  CodeMirror.registerHelper('hint', 'fromList', function (cm, options) {
    var cur = cm.getCursor()
    var token = cm.getTokenAt(cur)
    var term
    var from = CodeMirror.Pos(cur.line, token.start)
    var to = cur
    // 返回的token可能会有问题，进一步过滤
    var start = cur.ch - token.start
    while (start > 0 && /\w/.test(token.string.charAt(start - 1))) {
      start = start - 1
    }
    if (token.start < cur.ch && start < cur.ch - token.start) {
      term = token.string.substr(start, cur.ch - token.start - start)
    } else {
      term = ''
      from = cur
    }
    var found = []
    for (var i = 0; i < options.words.length; i++) {
      var word = options.words[i]
      if (word.slice(0, term.length) === term) {
        found.push(word)
      }
    }

    if (found.length) {
      return {list: found, from: from, to: to}
    }
  })

  function hintingFunction (cm, options) {
    // mode中的关键词
    options.words = modeKeyWords
    // 输入文本中的关键词
    const anyhint = CodeMirror.hint.anyword(cm, options)
    var modehint = CodeMirror.hint.fromList(cm, options)
    var words
    if (modehint) {
      words = new Set([...anyhint.list, ...modehint.list])
    } else {
      words = new Set([...anyhint.list])
    }
    if (words.size > 0) {
      return {
        list: Array.from(words),
        from: anyhint.from,
        to: anyhint.to
      }
    }
  }

  function updateModeKeyWords (editor, lang) {
    var keywords = []
    for (let type in langKeyWords[lang]) {
      keywords = keywords.concat(langKeyWords[lang][type])
    }
    keywords = keywords.concat(editor.getHelper(editor.getCursor(), 'hintWords'))
    modeKeyWords = Array.from(new Set(keywords))
  }

  export default {
    name: 'CodeMirror',
    components: {
      codemirror
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      languages: {
        type: Array,
        default: () => {
          return ['C', 'C++', 'Java', 'Python2']
        }
      },
      language: {
        type: String,
        default: 'C++'
      },
      theme: {
        type: String,
        default: 'material'
      }
    },
    data () {
      return {
        options: {
          // codemirror options
          tabSize: 4,
          indentUnit: 4,
          indentWithTabs: true,
          mode: 'text/x-csrc',
          theme: 'material',
          lineNumbers: true,
          line: true,
          // 代码折叠
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          // 选中文本自动高亮，及高亮方式
          styleSelectedText: true,
          lineWrapping: true,
          highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
          extraKeys: {
            'Ctrl': function (cm) {
              cm.showHint({hint: hintingFunction})
            },
            'F11': function (cm) {
              cm.setOption('fullScreen', !cm.getOption('fullScreen'))
            },
            'Esc': function (cm) {
              if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false)
            }
          },
          matchBrackets: true,
          fullscreen: true,
          continueComments: true,
          continueLineComment: false,
          autoCloseBrackets: true,
          hintOptions: {
            completeSingle: false // 当匹配只有一项的时候是否自动补全
          }
        },
        mode: {
          'C++': 'text/x-csrc'
        },
        themes: [
          {label: 'Monokai', value: 'monokai'},
          {label: 'Solarized Light', value: 'solarized'},
          {label: 'Material', value: 'material'}
        ]
      }
    },
    mounted () {
      utils.getLanguages().then(languages => {
        let mode = {}
        languages.forEach(lang => {
          mode[lang.name] = lang.content_type
        })
        this.mode = mode
        this.editor.setOption('mode', this.mode[this.language])
      })
      updateModeKeyWords(this.editor, this.language)
      this.editor.focus()
      this.editor.on('inputRead', function onChange (editor, input) {
        var token = /\w/
        if (token.test(input.text[0]) === false) {
          editor.closeHint()
          return
        }
        editor.showHint({hint: hintingFunction})
      })
    },
    methods: {
      onEditorCodeChange (newCode) {
        this.$emit('update:value', newCode)
      },
      onLangChange (newVal) {
        this.editor.setOption('mode', this.mode[newVal])
        updateModeKeyWords(this.editor, newVal)
        this.$emit('changeLang', newVal)
      },
      onThemeChange (newTheme) {
        this.editor.setOption('theme', newTheme)
        this.$emit('changeTheme', newTheme)
      },
      onResetClick () {
        this.$emit('resetCode')
      },
      onUploadFile () {
        document.getElementById('file-uploader').click()
      },
      onUploadFileDone () {
        let f = document.getElementById('file-uploader').files[0]
        let fileReader = new window.FileReader()
        let self = this
        fileReader.onload = function (e) {
          var text = e.target.result
          self.editor.setValue(text)
          document.getElementById('file-uploader').value = ''
        }
        fileReader.readAsText(f, 'UTF-8')
      },
      onFullScreen () {
        let self = this
        self.editor.setOption('fullScreen', !self.editor.getOption('fullScreen'))
        self.editor.focus()
      }
    },
    computed: {
      editor () {
        // get current editor object
        return this.$refs.myEditor.editor
      }
    },
    watch: {
      'theme' (newVal, oldVal) {
        this.editor.setOption('theme', newVal)
      }
    }
  }
</script>

<style lang="less" scoped>
  .header {
    margin: 5px 5px 15px 5px;
    .adjust {
      width: 150px;
      margin-left: 10px;
    }
    .fl-right {
      float: right;
    }
  }
</style>

<style lang="less">
.CodeMirror {
  height: auto !important;
}
.CodeMirror-scroll {
  min-height: 300px;
  max-height: 1000px;
}
.CodeMirror-fullscreen {
  position: fixed!important;
  top: 0; left: 0; right: 0; bottom: 0;
  height: auto;
  z-index: 9999;
}
.CodeMirror-hints {
  z-index: 9999;
}
.cm-matchhighlight {
  color: white !important;
  background-color: red;
}
.CodeMirror-selection-highlight-scrollbar {background-color: red}
</style>
