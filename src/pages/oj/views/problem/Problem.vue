<template>
  <div class="flex-container">
    <div id="problem-main">
      <!--problem main-->
      <Panel :padding="40" shadow>
        <div slot="title">{{problem.title}}</div>
        <div id="problem-content" class="markdown-body" v-katex>
          <p class="title">{{$t('m.Description')}}</p>
          <p class="content" v-html=problem.description></p>
          <!-- {{$t('m.music')}} -->
          <p class="title">{{$t('m.Input')}} <span v-if="problem.io_mode.io_mode=='File IO'">({{$t('m.FromFile')}}: {{ problem.io_mode.input }})</span></p>
          <p class="content" v-html=problem.input_description></p>

          <p class="title">{{$t('m.Output')}} <span v-if="problem.io_mode.io_mode=='File IO'">({{$t('m.ToFile')}}: {{ problem.io_mode.output }})</span></p>
          <p class="content" v-html=problem.output_description></p>

          <div v-for="(sample, index) of problem.samples" :key="index">
            <div class="flex-container sample">
              <div class="sample-input">
                <p class="title">{{$t('m.Sample_Input')}} {{index + 1}}
                  <a class="copy"
                     v-clipboard:copy="sample.input"
                     v-clipboard:success="onCopy"
                     v-clipboard:error="onCopyError">
                    <Icon type="clipboard"></Icon>
                  </a>
                </p>
                <pre>{{sample.input}}</pre>
              </div>
              <div class="sample-output">
                <p class="title">{{$t('m.Sample_Output')}} {{index + 1}}</p>
                <pre>{{sample.output}}</pre>
              </div>
            </div>
          </div>

          <div v-if="problem.hint">
            <p class="title">{{$t('m.Hint')}}</p>
            <Card dis-hover>
              <div class="content" v-html=problem.hint></div>
            </Card>
          </div>

          <div v-if="problem.source">
            <p class="title">{{$t('m.Source')}}</p>
            <p class="content">{{problem.source}}</p>
          </div>

        </div>
      </Panel>
      <!--problem main end-->
      <Card :padding="20" id="submit-code" dis-hover>
        <CodeMirror :value.sync="code"
                    :languages="problem.languages"
                    :language="language"
                    :theme="theme"
                    @resetCode="onResetToTemplate"
                    @changeTheme="onChangeTheme"
                    @changeLang="onChangeLang"></CodeMirror>
        <Row type="flex" justify="space-between">
          <Col :span="10">
            <div class="status" v-if="statusVisible">
              <template v-if="!this.contestID || (this.contestID && OIContestRealTimePermission)">
                <span>{{$t('m.Status')}}</span>
                <Tag type="dot" :color="submissionStatus.color" @click.native="handleRoute('/status/'+submissionId)">
                  {{submissionStatus.text}}
                </Tag>
              </template>
              <template v-else-if="this.contestID && !OIContestRealTimePermission">
                <Alert type="success" show-icon>Submitted successfully</Alert>
              </template>
            </div>
            <div v-else-if="problem.my_status === 0">
              <Alert type="success" show-icon>You have solved the problem</Alert>
            </div>
            <div v-else-if="this.contestID && !OIContestRealTimePermission && submissionExists">
              <Alert type="success" show-icon>You have submitted a solution.</Alert>
            </div>
            <div v-if="contestEnded">
              <Alert type="warning" show-icon>Contest has ended</Alert>
            </div>
          </Col>

          <Col :span="12">
            <template v-if="captchaRequired">
              <div class="captcha-container">
                <Tooltip v-if="captchaRequired" content="Click to refresh" placement="top">
                  <img :src="captchaSrc" @click="getCaptchaSrc"/>
                </Tooltip>
                <Input v-model="captchaCode" class="captcha-code"/>
              </div>
            </template>
            <Button type="warning" icon="edit" :loading="submitting" @click="submitCode"
                    :disabled="problemSubmitDisabled || submitted"
                    class="fl-right">
              <span v-if="submitting">Submitting</span>
              <span v-else>Submit</span>
            </Button>
            <Button v-if="!selftestOpened" type="success" icon="ios-arrow-down" @click="openSelftest" class="fl-right" style="margin-right:5px;">
              <span>Local Test</span>
            </Button>
            <Button v-if="selftestOpened" type="error" icon="ios-arrow-up" @click="openSelftest" class="fl-right" style="margin-right:5px;">
              <span>Local Test</span>
            </Button>
          </Col>
        </Row>
      </Card>

      <Card :padding="20" id="selftestbox" dis-hover v-if="selftestOpened">
        <div class="subbox_left">
          <h3>Test Case:</h3>
          <Input v-model="testCase" type="textarea" :autosize="{minRows: 15,maxRows: 15}" placeholder="Enter the case you want to test" />
          <Button :loading="selftestloading" type="primary" style="margin-top:10px;float:left;" @click="submitSelftest">
              <span v-if="selftestloading">Running</span>
              <span v-else>Run it !</span>
          </Button>
        </div>
        <div class="subbox_right">
          <h3>Result:</h3>
          <Input v-model="testOutput" type="textarea" :autosize="{minRows: 15,maxRows: 15}" readonly />
        </div>
      </Card>
    </div>

    <div id="right-column">
      <VerticalMenu @on-click="handleRoute">
        <template v-if="this.contestID">
          <VerticalMenu-item :route="{name: 'contest-problem-list', params: {contestID: contestID}}">
            <Icon type="ios-photos"></Icon>
            Problems
          </VerticalMenu-item>

          <VerticalMenu-item :route="{name: 'contest-announcement-list', params: {contestID: contestID}}">
            <Icon type="chatbubble-working"></Icon>
            Announcements
          </VerticalMenu-item>
        </template>

        <VerticalMenu-item v-if="!this.contestID || OIContestRealTimePermission" :route="submissionRoute">
          <Icon type="navicon-round"></Icon>
          Submissions
        </VerticalMenu-item>

        <template v-if="this.contestID">
          <VerticalMenu-item v-if="!this.contestID || OIContestRealTimePermission"
                             :route="{name: 'contest-rank', params: {contestID: contestID}}">
            <Icon type="stats-bars"></Icon>
            Rankings
          </VerticalMenu-item>
          <VerticalMenu-item :route="{name: 'contest-details', params: {contestID: contestID}}">
            <Icon type="home"></Icon>
            View Contest
          </VerticalMenu-item>
        </template>
      </VerticalMenu>

      <Card id="info">
        <div slot="title" class="header">
          <Icon type="information-circled"></Icon>
          <span class="card-title">{{$t('m.Information')}}</span>
        </div>
        <ul>
          <li><p>ID</p>
            <p>{{problem._id}}</p></li>
          <li>
            <p>{{$t('m.Time_Limit')}}</p>
            <p>{{problem.time_limit}}MS</p></li>
          <li>
            <p>{{$t('m.Memory_Limit')}}</p>
            <p>{{problem.memory_limit}}MB</p></li>
          <li>
          <li>
            <p>{{$t('m.IOMode')}}</p>
            <p>{{problem.io_mode.io_mode}}</p>
          </li>
          <li>
            <p>{{$t('m.Created')}}</p>
            <p>{{problem.created_by.username}}</p></li>
          <li v-if="problem.difficulty">
            <p>{{$t('m.Level')}}</p>
            <p>{{problem.difficulty}}</p></li>
          <li v-if="problem.total_score">
            <p>{{$t('m.Score')}}</p>
            <p>{{problem.total_score}}</p>
          </li>
          <li>
            <p>{{$t('m.Tags')}}</p>
            <p>
              <Poptip placement="left-end" @on-popper-show="sendTagStatement">
                <a>Show</a>
                <div slot="content">
                  <Tag v-for="tag in problem.tags" :key="tag">{{tag}}</Tag>
                </div>
              </Poptip>
            </p>
          </li>
        </ul>
      </Card>

      <Card id="lastSubmissions" v-if="true">
        <div slot="title">
          <Icon type="ios-analytics"></Icon>
          <span class="card-title">历史提交</span>
          <Button v-if="this.contestID" type="ghost" size="small" id="detail" @click="handleRoute('/contest/' + contestID + '/submissions?myself=1&page=1&contestID=' + contestID)">More</Button>
          <Button v-else type="ghost" size="small" id="detail" @click="handleRoute('../status?myself=1&username=' + user.username + '&problemID=' + problemID)">More</Button>
        </div>
        <ul>
          <li v-for="(submission, index) in lastSubmissions" :key="index">
            <router-link :to="'../status/' + submission.id">
              <p><Tag :color="getStatusTextColor(submission.result)">{{ mapToResult(submission.result) }}</Tag></p>
              <p>{{ changeUtcTime(submission.create_time) }}</p>
            </router-link>
          </li>
        </ul>
      </Card>

      <Card id="recommendUser" v-if="recommendList.user">
        <div slot="title" class="header">
          <Icon type="checkmark-circled"></Icon>
          <span class="card-title">用户推荐</span>
        </div>
          <Button v-for="user in recommendList.user"
                  @click="pickUser(user)"
                  :key="user"
                  type="ghost"
                  shape="circle"
                  class="tag-btn">{{user}}
          </Button>
      </Card>

      <Card id="recommendProblems" v-if="recommendList.problems_info">
        <div slot="title" class="header">
          <Icon type="checkmark-circled"></Icon>
          <span class="card-title">题目推荐</span>
        </div>
        <Button v-for="problem in recommendList.problems_info"
        @click="pickProblem(problem['_id'], problem['contest_id'])"
        :key="problem"
        type="ghost"
        shape="circle"
        class="tag-btn">{{problem['title']}}
        </Button>
      </Card>

      <Card id="pieChart" :padding="0" v-if="!this.contestID || OIContestRealTimePermission">
        <div slot="title">
          <Icon type="ios-analytics"></Icon>
          <span class="card-title">Statistic</span>
          <Button type="ghost" size="small" id="detail" @click="graphVisible = !graphVisible">Details</Button>
        </div>
        <div class="echarts">
          <ECharts :options="pie"></ECharts>
        </div>
      </Card>
    </div>

    <Modal v-model="graphVisible">
      <div id="pieChart-detail">
        <ECharts :options="largePie" :initOptions="largePieInitOpts"></ECharts>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="graphVisible=false">Close</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {types} from '../../../../store'
  import CodeMirror from '@oj/components/CodeMirror.vue'
  import storage from '@/utils/storage'
  import {FormMixin} from '@oj/components/mixins'
  import {JUDGE_STATUS, CONTEST_STATUS, buildProblemCodeKey} from '@/utils/constants'
  import api from '@oj/api'
  import {pie, largePie} from './chartData'
  import time from '@/utils/time'

  // 只显示这些状态的图形占用
  const filtedStatus = ['-1', '-2', '0', '1', '2', '3', '4', '8']

  export default {
    name: 'Problem',
    components: {
      CodeMirror
    },
    mixins: [FormMixin],
    data () {
      return {
        recommendList: [],
        statusVisible: false,
        captchaRequired: false,
        graphVisible: false,
        submissionExists: false,
        captchaCode: '',
        captchaSrc: '',
        contestID: '',
        problemID: '',
        submitting: false,
        code: '',
        language: 'C',
        theme: 'material',
        submissionId: '',
        submitted: false,
        result: {
          result: 9
        },
        problem: {
          title: '',
          description: '',
          hint: '',
          my_status: '',
          template: {},
          languages: [],
          created_by: {
            username: ''
          },
          tags: [],
          io_mode: {'io_mode': 'Standard IO'}
        },
        pie: pie,
        largePie: largePie,
        // echarts 无法获取隐藏dom的大小，需手动指定
        largePieInitOpts: {
          width: '500',
          height: '480'
        },
        lastSubmissions: [],
        testCase: '',
        testOutput: '',
        selftestOpened: false,
        refreshSelftestStatus: false,
        selftestloading: false
      }
    },
    beforeRouteEnter (to, from, next) {
      let problemCode = storage.get(buildProblemCodeKey(to.params.problemID, to.params.contestID))
      if (problemCode) {
        next(vm => {
          vm.language = problemCode.language
          vm.code = problemCode.code
          vm.theme = problemCode.theme
        })
      } else {
        next()
      }
    },
    mounted () {
      this.$store.commit(types.CHANGE_CONTEST_ITEM_VISIBLE, {menu: false})
      this.init()
      this.getRecommendList()
      this.getLastSubmission()
    },
    methods: {
      ...mapActions(['changeDomTitle']),
      init () {
        this.$Loading.start()
        this.contestID = this.$route.params.contestID
        this.problemID = this.$route.params.problemID
        let func = this.$route.name === 'problem-details' ? 'getProblem' : 'getContestProblem'
        api[func](this.problemID, this.contestID).then(res => {
          this.$Loading.finish()
          let problem = res.data.data
          this.changeDomTitle({title: problem.title})
          api.submissionExists(problem.id).then(res => {
            this.submissionExists = res.data.data
          })
          problem.languages = problem.languages.sort()
          this.problem = problem
          this.changePie(problem)

          // 在beforeRouteEnter中修改了, 说明本地有code，无需加载template
          if (this.code !== '') {
            return
          }
          // try to load problem template
          this.language = this.problem.languages[0]
          let template = this.problem.template
          if (template && template[this.language]) {
            this.code = template[this.language]
          }
        }, () => {
          this.$Loading.error()
        })
      },
      changePie (problemData) {
        // 只显示特定的一些状态
        for (let k in problemData.statistic_info) {
          if (filtedStatus.indexOf(k) === -1) {
            delete problemData.statistic_info[k]
          }
        }
        let acNum = problemData.accepted_number
        let data = [
          {name: 'WA', value: problemData.submission_number - acNum},
          {name: 'AC', value: acNum}
        ]
        this.pie.series[0].data = data
        // 只把大图的AC selected下，这里需要做一下deepcopy
        let data2 = JSON.parse(JSON.stringify(data))
        data2[1].selected = true
        this.largePie.series[1].data = data2

        // 根据结果设置legend,没有提交过的legend不显示
        let legend = Object.keys(problemData.statistic_info).map(ele => JUDGE_STATUS[ele].short)
        if (legend.length === 0) {
          legend.push('AC', 'WA')
        }
        this.largePie.legend.data = legend

        // 把ac的数据提取出来放在最后
        let acCount = problemData.statistic_info['0']
        delete problemData.statistic_info['0']

        let largePieData = []
        Object.keys(problemData.statistic_info).forEach(ele => {
          largePieData.push({name: JUDGE_STATUS[ele].short, value: problemData.statistic_info[ele]})
        })
        largePieData.push({name: 'AC', value: acCount})
        this.largePie.series[0].data = largePieData
      },
      handleRoute (route) {
        this.$router.push(route)
      },
      onChangeLang (newLang) {
        if (this.problem.template[newLang]) {
          if (this.code.trim() === '') {
            this.code = this.problem.template[newLang]
          }
        }
        this.language = newLang
      },
      onChangeTheme (newTheme) {
        this.theme = newTheme
      },
      onResetToTemplate () {
        this.$Modal.confirm({
          content: 'Are you sure you want to reset your code?',
          onOk: () => {
            let template = this.problem.template
            if (template && template[this.language]) {
              this.code = template[this.language]
            }
          }
        })
      },
      checkSubmissionStatus () {
        // 使用setTimeout避免一些问题
        if (this.refreshStatus) {
          // 如果之前的提交状态检查还没有停止,则停止,否则将会失去timeout的引用造成无限请求
          clearTimeout(this.refreshStatus)
        }
        const checkStatus = () => {
          let id = this.submissionId
          api.getSubmission(id).then(res => {
            this.result = res.data.data
            if (Object.keys(res.data.data.statistic_info).length !== 0) {
              this.submitting = false
              this.submitted = false
              clearTimeout(this.refreshStatus)
              this.init()
            } else {
              this.refreshStatus = setTimeout(checkStatus, 2000)
            }
          }, res => {
            this.submitting = false
            clearTimeout(this.refreshStatus)
          })
        }
        this.refreshStatus = setTimeout(checkStatus, 2000)
      },
      submitCode () {
        if (this.code.trim() === '') {
          this.$error('Code can not be empty')
          return
        }
        this.submissionId = ''
        this.result = {result: 9}
        this.submitting = true
        let data = {
          problem_id: this.problem.id,
          language: this.language,
          code: this.code,
          contest_id: this.contestID
        }
        if (this.captchaRequired) {
          data.captcha = this.captchaCode
        }
        const submitFunc = (data, detailsVisible) => {
          this.statusVisible = true
          api.submitCode(data).then(res => {
            this.submissionId = res.data.data && res.data.data.submission_id
            // 定时检查状态
            this.submitting = false
            this.submissionExists = true
            if (!detailsVisible) {
              this.$Modal.success({
                title: 'Success',
                content: 'Submit code successfully'
              })
              return
            }
            // console.log('sendSubmitStatement start!')
            if (this.contestID) {
              setTimeout(
                // eslint-disable-next-line no-undef
                sendStatement(this.user.username ? this.user.username : 'null', this.user.email ? this.user.email : 'null@null.com', 'submitContestProblem', 'http://submitContestProblem', this.contestID + ':' + this.problemID, 'http://contestProblemId'), 0
              )
            } else {
              setTimeout(
              // eslint-disable-next-line no-undef
              sendStatement(this.user.username ? this.user.username : 'null', this.user.email ? this.user.email : 'null@null.com', 'submitCommonProblem', 'http://submitCommonProblem', this.problemID, 'http://commonProblemId'), 0
              )
            }
            // console.log('sendSubmitStatement success!')
            this.submitted = true
            this.checkSubmissionStatus()
            this.getLastSubmission()
          }, res => {
            this.getCaptchaSrc()
            if (res.data.data.startsWith('Captcha is required')) {
              this.captchaRequired = true
            }
            this.submitting = false
            this.statusVisible = false
          })
        }

        if (this.contestRuleType === 'OI' && !this.OIContestRealTimePermission) {
          if (this.submissionExists) {
            this.$Modal.confirm({
              title: '',
              content: '<h3>You have submission in this problem, sure to cover it?<h3>',
              onOk: () => {
                // 暂时解决对话框与后面提示对话框冲突的问题(否则一闪而过）
                setTimeout(() => {
                  submitFunc(data, false)
                }, 1000)
              },
              onCancel: () => {
                this.submitting = false
              }
            })
          } else {
            submitFunc(data, false)
          }
        } else {
          submitFunc(data, true)
        }

        let mayuanData = {
          problem_id: this.problem._id,
          problem_name: this.problem.title,
          contest_id: this.contestID,
          judge_id: this.submissionId,
          judge_status: this.submissionStatus.text,
          code: this.code
        }
        api.uploadCode(mayuanData).then(res => {
          // console.log('upload code success')
        }, res => {
          // console.log('upload code failed')
        })
      },
      onCopy (event) {
        this.$success('Code copied')
      },
      onCopyError (e) {
        this.$error('Failed to copy code')
      },
      sendTagStatement () {
        // console.log('sendTagStatement start!')
        if (this.contestID) {
          // eslint-disable-next-line no-undef
          sendStatement(this.user.username ? this.user.username : 'null', this.user.email ? this.user.email : 'null@null.com', 'showContestProblemTags', 'http://showContestProblemTags', this.contestID + ':' + this.problemID, 'http://contestProblemId')
          // console.log('sendTagStatement success!')
        } else {
          // eslint-disable-next-line no-undef
          sendStatement(this.user.username ? this.user.username : 'null', this.user.email ? this.user.email : 'null@null.com', 'showCommonProblemTags', 'http://showCommonProblemTags', this.problemID, 'http://commonProblemId')
        }
      },
      getRecommendList () {
        var userId = this.getUserId()
        if (userId) {
          api.getRecommendList(this.getUserId(), 5, 7).then(res => { this.recommendList = res.data.data }, res => {})
        }
      },
      getUserId () {
        // if (window.localStorage.getItem('userId')) {
        //   return window.localStorage.getItem('userId')
        // }
        var res = this.user.id
        // window.localStorage.setItem('userId', this.user.id)
        return res
      },
      pickUser (userName) {
        this.$router.push({name: 'user-home', query: {username: userName}})
      },
      pickProblem (_id, contestId) {
        if (contestId == null) {
          this.$router.push({name: 'problem-details', params: {problemID: _id}})
        } else {
          this.$router.push({
            name: 'contest-problem-details',
            params: {
              contestID: contestId,
              problemID: _id
            }
          })
        }
      },
      getLastSubmission () {
        let isContest = !(this.$route.name === 'problem-details')
        if (isContest) {
          api.getContestSubmissionList(0, 10, { username: this.user.username, myself: true, problem_id: this.problemID, contest_id: this.contestID }).then(res => {
            this.lastSubmissions = res.data.data.results
            // console.log(this.lastSubmissions)
          }).catch(_ => {
            console.log('some error in getLastSubmission')
          })
        } else {
          api.getSubmissionList(0, 10, { username: this.user.username, myself: true, problem_id: this.problemID }).then(res => {
            this.lastSubmissions = res.data.data.results
            // console.log(this.lastSubmissions)
          }).catch(_ => {
            console.log('some error in getLastSubmission')
          })
        }
      },
      changeUtcTime (tt) {
        return time.utcToLocal(tt).substr(time.utcToLocal(tt).indexOf('-') + 1)
      },
      mapToResult (resultCode) {
        return JUDGE_STATUS[resultCode].name
      },
      getStatusTextColor (resultCode) {
        return JUDGE_STATUS[resultCode].color
      },
      openSelftest () {
        this.selftestOpened = !this.selftestOpened
      },
      checkSelftestStatus () {
        if (this.refreshSelftestStatus) {
          // 如果之前的提交状态检查还没有停止,则停止,否则将会失去timeout的引用造成无限请求
          clearTimeout(this.refreshSelftestStatus)
        }
        const checkStatus = () => {
          api.getSelftestResult().then(res => {
            console.log(res)
            if (res.data.data.status < 6) {
              if (res.data.data.status !== 0) {
                this.testOutput = JUDGE_STATUS[res.data.data.status].name + '\n\n\n' + res.data.data.info.err_info
              } else {
                this.testOutput = res.data.data.output[0].output
              }
              clearTimeout(this.refreshSelftestStatus)
              this.selftestloading = false
            } else {
              this.refreshSelftestStatus = setTimeout(checkStatus, 2000)
            }
          }, res => {
            clearTimeout(this.refreshSelftestStatus)
          })
        }
        this.refreshSelftestStatus = setTimeout(checkStatus, 2000)
      },
      submitSelftest () {
        if (this.code.trim() === '') {
          this.$error('Code can not be empty')
          return
        }
        let data = {
          language: this.language,
          code: this.code,
          test_case: [{
            input: this.testCase,
            output: ''
          }]
        }
        this.selftestloading = true
        api.selftest(data).then(res => {
          this.checkSelftestStatus()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    computed: {
      ...mapGetters(['problemSubmitDisabled', 'contestRuleType', 'OIContestRealTimePermission', 'contestStatus', 'user']),
      contest () {
        return this.$store.state.contest.contest
      },
      contestEnded () {
        return this.contestStatus === CONTEST_STATUS.ENDED
      },
      submissionStatus () {
        return {
          text: JUDGE_STATUS[this.result.result]['name'],
          color: JUDGE_STATUS[this.result.result]['color']
        }
      },
      submissionRoute () {
        if (this.contestID) {
          return {name: 'contest-submission-list', query: {problemID: this.problemID}}
        } else {
          return {name: 'submission-list', query: {problemID: this.problemID}}
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      // 防止切换组件后仍然不断请求
      clearInterval(this.refreshStatus)

      this.$store.commit(types.CHANGE_CONTEST_ITEM_VISIBLE, {menu: true})
      storage.set(buildProblemCodeKey(this.problem._id, from.params.contestID), {
        code: this.code,
        language: this.language,
        theme: this.theme
      })
      next()
    },
    watch: {
      '$route' () {
        this.init()
      }
    }
  }
</script>

<style lang="less" scoped>
  .card-title {
    margin-left: 8px;
  }

  .flex-container {
    #problem-main {
      flex: auto;
      margin-right: 18px;
    }
    #right-column {
      flex: none;
      width: 220px;
    }
  }

  #problem-content {
    margin-top: -50px;
    .title {
      font-size: 20px;
      font-weight: 400;
      margin: 25px 0 8px 0;
      color: #3091f2;
      .copy {
        padding-left: 8px;
      }
    }
    p.content {
      margin-left: 25px;
      margin-right: 20px;
      font-size: 15px
    }
    .sample {
      align-items: stretch;
      &-input, &-output {
        width: 50%;
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        margin-right: 5%;
      }
      pre {
        flex: 1 1 auto;
        align-self: stretch;
        border-style: solid;
        background: transparent;
      }
    }
  }

  #submit-code {
    margin-top: 20px;
    margin-bottom: 20px;
    .status {
      float: left;
      span {
        margin-right: 10px;
        margin-left: 10px;
      }
    }
    .captcha-container {
      display: inline-block;
      .captcha-code {
        width: auto;
        margin-top: -20px;
        margin-left: 20px;
      }
    }
  }

  #info {
    margin-bottom: 20px;
    margin-top: 20px;
    ul {
      list-style-type: none;
      li {
        border-bottom: 1px dotted #e9eaec;
        margin-bottom: 10px;
        p {
          display: inline-block;
        }
        p:first-child {
          width: 90px;
        }
        p:last-child {
          float: right;
        }
      }
    }
  }

  .fl-right {
    float: right;
  }

  #recommendUser{
    margin-bottom: 20px;
    margin-top: 20px;
  }

  #recommendProblems{
    margin-bottom: 20px;
    margin-top: 20px;
  }

  #pieChart {
    .echarts {
      height: 250px;
      width: 210px;
    }
    #detail {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }

  #pieChart-detail {
    margin-top: 20px;
    width: 500px;
    height: 480px;
  }

  .tag-btn {
    margin-right: 5px;
    margin-bottom: 10px;
  }

  #lastSubmissions {
    margin-top: 20px;
    ul {
      list-style-type: none;
      li {
        border-bottom: 1px dotted #e9eaec;
        margin-bottom: 10px;
        a{
          text-decoration: none;
        }
        p {
          display: inline-block;
          color:black;
        }
        p:first-child {
          width: auto;
        }
        p:last-child {
          float: right;
        }
      }
    }
  }

 #selftestbox {
    height: 420px;
    .subbox_left {
      width: 48%;
      height: 380px;
      float: left;
    }
    .subbox_right{
      width: 48%;
      height: 380px;
      float: right;
     }
   }

</style>

