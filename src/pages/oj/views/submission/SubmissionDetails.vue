<template>
  <Row type="flex" justify="space-around">
    <Col :span="20" id="status">
      <Alert :type="status.type" showIcon>
        <span class="title">{{status.statusName}}</span>
        <div slot="desc" class="content">
          <template v-if="isCE">
            <pre>{{submission.statistic_info.err_info}}</pre>
          </template>
          <template v-else>
            <span>Time: {{submission.statistic_info.time_cost | submissionTime}}</span>
            <span>Memory: {{submission.statistic_info.memory_cost | submissionMemory}}</span>
            <span>Lang: {{submission.language}}</span>
            <span>Author: {{submission.username}}</span>
          </template>
        </div>
      </Alert>
    </Col>

    <!--后台返info就显示出来， 权限控制放后台 -->
    <Col v-if="submission.info && !isCE" :span="20">
        <Table stripe :loading="loading" :disabled-hover="true" :columns="columns" :data="submission.info.data"></Table>
    </Col>

    <Col :span="20">
      <Highlight :code="submission.code" :language="submission.language" :border-color="status.color"></Highlight>
    </Col>

    <Col v-if="submission.can_unshare" :span="20">
      <div id="share-btn">
        <Button v-if="submission.shared"
                type="warning" size="large" @click="shareSubmission(false)">
          UnShare
        </Button>
        <Button v-else
                type="primary" size="large" @click="shareSubmission(true)">
          Share
        </Button>
        <Button size="large" icon="ios-download-outline" type="primary" @click.native="downloadTestCase(submission.problem)">Test Case</Button>
        <Button size="large" type="primary" @click="predict()" v-if="submission.info && !isCE && !isAC && isCLang" v-bind:disabled="predictButton">代码错误预测</Button>
        <Button size="large" type="primary" @click="modal11 = true">标注错误</Button>
        <Modal
          v-model="modal10"
          title="Error prediction">
          <div v-if="1 == 2"></div>
          <Progress v-for="(predict,index) in errorPredictResults['name']" :percent="errorPredictResults['prob'][index] * 100.0" :key="index">{{predict}}&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{Math.floor(errorPredictResults['prob'][index]*100.0 * 100.0) / 100.0}}%</Progress>
        </Modal>
        <Modal
          v-model="modal11"
          title="Annotation error"
          @on-ok="handleUploadErrorAnnotation"
          @on-cancel="handleCloseErrorAnnotation">
          <div v-if="1 == 2"></div>
          <CheckboxGroup v-model="errors">
              <Row v-for="(error, id) in showErrors" :key="id">
                <Checkbox :label="error" ></Checkbox>
              </Row>
          </CheckboxGroup>
          <Checkbox @on-change="handleOtherErrorCheck">
            <Input v-model="otherError" placeholder="请输入其它错误" style="width: 300px" />
          </Checkbox>
        </Modal>
      </div>
    </Col>
  </Row>
</template>

<script>
  import api from '@oj/api'
  import {JUDGE_STATUS} from '@/utils/constants'
  import utils from '@/utils/utils'
  import Highlight from '@/pages/oj/components/Highlight'
  import expandRow from './table-expand.vue'
  import { mapGetters } from 'vuex'

  const baseColumn = [
    {
      title: 'ID',
      align: 'center',
      type: 'index'
    },
    {
      title: 'Status',
      align: 'center',
      render: (h, params) => {
        return h('Tag', {
          props: {
            color: JUDGE_STATUS[params.row.result].color
          }
        }, JUDGE_STATUS[params.row.result].name)
      }
    },
    {
      title: 'Memory',
      align: 'center',
      render: (h, params) => {
        return h('span', utils.submissionMemoryFormat(params.row.memory))
      }
    },
    {
      title: 'Time',
      align: 'center',
      render: (h, params) => {
        return h('span', utils.submissionTimeFormat(params.row.cpu_time))
      }
    }
  ]
  const scoreColumn = [{
    title: 'Score',
    align: 'center',
    key: 'score'
  }]
  const adminColumn = [
    {
      title: 'Real Time',
      align: 'center',
      render: (h, params) => {
        return h('span', utils.submissionTimeFormat(params.row.real_time))
      }
    },
    {
      title: 'Singal',
      align: 'center',
      key: 'signal'
    }
  ]

  const expandColumn = [
    {
      type: 'expand',
      width: 120,
      align: 'center',
      render: (h, params) => {
        return h(expandRow, {
          props: {
            row: params.row
          }
        })
      }
    }
  ]

  export default {
    name: 'submissionDetails',
    components: {
      Highlight
    },
    data () {
      return {
        predictButton: false,
        errorPredictResults: [],
        modal10: false,
        modal11: false,
        columns: [],
        submission: {
          result: '0',
          code: '',
          info: {
            data: []
          },
          statistic_info: {
            time_cost: '',
            memory_cost: ''
          }
        },
        isConcat: false,
        loading: false,
        showErrors: [ '循环错误', '输出格式未按要求', '运算符错误', '缺少输出', '输入字符串错误', '逻辑错误', '输入变量错误', '初始化错误', '类型使用错误', '类型运算精度问题', '判断错误' ],
        errors: [],
        otherError: '',
        isOtherErrorChecked: false
      }
    },
    mounted () {
      this.getSubmission()
    },
    methods: {
      predict () {
        this.predictButton = true
        this.$Message.info('正在预测，请等待')
        api.getCode2vecList(this.submission.code).then(
          res => {
            console.log(res)
            const result = res.data.data
            this.errorPredictResults = result
            this.modal10 = true
            this.predictButton = false
          }, res => {
          console.log('请求失败')
        }
        )
      },
      getSubmission () {
        this.loading = true
        api.getSubmission(this.$route.params.id).then(res => {
          this.loading = false
          let data = res.data.data
          let columns
          // if (this.isAdminRole || data.contest == null) {
          //   columns = expandColumn
          //   columns = columns.concat(baseColumn)
          // } else {
          //   columns = baseColumn
          // }
          // 现在是problems和考试都显示箭头，可以查看具体数据
          columns = expandColumn
          columns = columns.concat(baseColumn)
          if (data.info && data.info.data && !this.isConcat) {
            // score exist means the submission is OI problem submission
            if (data.info.data[0].score !== undefined) {
              this.isConcat = true
              columns = columns.concat(scoreColumn)
            }
            if (this.isAdminRole) {
              this.isConcat = true
              columns = columns.concat(adminColumn)
            }
            this.columns = columns
          }
          this.submission = data
          // console.log('sendStatement start!')
          // console.log(this.user)
          // eslint-disable-next-line no-undef
          sendStatement(this.user.username ? this.user.username : 'null', this.user.email ? this.user.email : 'null@null.com', 'showCodeSubmission', 'http://showCodeSubmission', this.submission.id, 'http://submissionId')
          // console.log('sendStatement success!')
        }, () => {
          this.loading = false
        })
      },
      shareSubmission (shared) {
        let data = {id: this.submission.id, shared: shared}
        api.updateSubmission(data).then(res => {
          this.getSubmission()
          this.$success('Succeeded')
        }, () => {
        })
      },
      downloadTestCase (problemID) {
        let url = '/admin/test_case?problem_id=' + problemID
        utils.downloadFile(url)
      },
      handleOtherErrorCheck (value) {
        this.isOtherErrorChecked = value
      },
      handleUploadErrorAnnotation () {
        let errors = this.errors
        if (this.isOtherErrorChecked) {
          errors.push(this.otherError)
        }
        api.saveErrorAnnotation(this.$route.params.id, errors).then(res => {
          this.$Message.success('标注成功')
          this.handleCloseErrorAnnotation()
        }, res => {
          console.log('请求失败')
        })
      },
      handleCloseErrorAnnotation () {
        this.errors = []
        this.isOtherErrorChecked = false
        this.otherError = ''
      }
    },
    computed: {
      status () {
        return {
          type: JUDGE_STATUS[this.submission.result].type,
          statusName: JUDGE_STATUS[this.submission.result].name,
          color: JUDGE_STATUS[this.submission.result].color
        }
      },
      isCE () {
        return this.submission.result === -2
      },
      isAC () {
        return this.submission.result === 0
      },
      isCLang () {
        return this.submission.language === 'C' || this.submission.language === 'C++'
      },
      isAdminRole () {
        return this.$store.getters.isAdminRole
      },
      singleSubtask () {
        return this.submission.info.data.length === 1
      },
      ...mapGetters(['user'])
    }
  }
</script>

<style scoped lang="less">
  #status {
    .title {
      font-size: 20px;
    }
    .content {
      margin-top: 10px;
      font-size: 14px;
      span {
        margin-right: 10px;
      }
      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }

  .admin-info {
    margin: 5px 0;
    &-content {
      font-size: 16px;
      padding: 10px;
    }
  }

  #share-btn {
    float: right;
    margin-top: 5px;
    margin-right: 10px;
  }

  pre {
    border: none;
    background: none;
  }
</style>
