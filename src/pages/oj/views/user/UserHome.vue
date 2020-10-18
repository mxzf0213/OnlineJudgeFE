<template>
  <div class="container">
    <div class="avatar-container">
      <img class="avatar" :src="profile.avatar"/>
      <p v-show="this.ifUserPortrait()"> <tag color="blue"> {{labels[0]}} </tag> <tag color="blue">{{labels[1]}}</tag> <tag color="blue">{{labels[2]}}</tag> <tag color="blue">{{labels[3]}}</tag><tag color="blue"> {{labels[4]}} </tag> <tag color="blue">{{labels[5]}}</tag> <tag color="blue">{{labels[6]}}</tag> <tag color="blue">{{labels[7]}}</tag></p>
    </div>

    <div><p></p></div>

    <Card :padding="10">

      <div v-if="profile.user">
        <p style="margin-top: -10px">
          <span v-if="profile.user" class="emphasis">{{profile.user.username}}</span>
          <span v-if="profile.school">@{{profile.school}}</span>
        </p>
        <p v-if="profile.mood">
          {{profile.mood}}
        </p>
        <hr class="split" style="margin-top: 20px"/>
        <hr v-if="this.ifUserPortrait()" class="split" style="margin-top: 40px"/>
      </div>



      <div v-show="this.ifUserPortrait()" id="userPortraitRegion">

      <card style="border-color: blanchedalmond; margin-top: 10px;border-style: solid; border-width: 4px; text-align: center">
        <p class="emphasis" style="font-size:60px">你的水杉校场年度报告</p>

        <div>
          <Button-group  shape="circle">
            <i-button type="success" @click="downReport()" style="font-size: x-large">
              ～快来下载九宫格画像吧
              <Icon type="arrow-down-a"></Icon>
            </i-button>
            <i-button type="info" @click="showQRcode()" style="font-size: x-large">
              <Icon type="share"></Icon>
              扫描二维码有惊喜的哦～
            </i-button>
          </Button-group>
<!--          <i-button style="margin-top: 10px"  type="info" icon = 'ios-download' @click="downReport()">点击收获你的称号勋章</i-button>-->
        </div>
        <div id="qrcodeDiv" v-show="qrcodeVis" @click="closeQRcode()">
          <span id="qrcode" ></span>
        </div>
<!--        <card>-->
<!--          <img src="static/img/totalreport/李云帆.jpeg" width="auto" height="1000" >-->
<!--        </card>-->





        <div v-if="this.ifUserPortrait()" class="flex-container">
          <div class="left">
            <Card class="portraitText" :style="'background-image: url(static/img/userReport/'+this.getUserName()+'/'+this.getUserName()+'_在线格.png); background-size: cover'">
            </Card>
          </div>
          <div class="middle">
            <Card class="portraitText" :style="'background-image: url(static/img/userReport/'+this.getUserName()+'/'+this.getUserName()+'_下线格.png); background-size: cover'">
            </Card>
          </div>
          <div class="right">
            <Card class="portraitText" :style="'background-image: url(static/img/userReport/'+this.getUserName()+'/'+this.getUserName()+'_速度格.png); background-size: cover'">
            </Card>
          </div>
        </div>
        <div v-if="this.ifUserPortrait()" class="flex-container">
          <div class="left">
            <Card class="portraitText" :style="'background-image: url(static/img/userReport/'+this.getUserName()+'/'+this.getUserName()+'_知识格.png); background-size: cover'">
            </Card>
          </div>
          <div class="middle">
            <Card class="portraitText" :style="'background-image: url(static/img/userReport/'+this.getUserName()+'/'+this.getUserName()+'_雷达图.png); background-size: cover'">
            </Card>
          </div>
          <div class="right">
            <Card class="portraitText" :style="'background-image: url(static/img/userReport/'+this.getUserName()+'/'+this.getUserName()+'_提交格.png); background-size: cover'">
            </Card>
          </div>
        </div>

        <div v-if="this.ifUserPortrait()" class="flex-container">
          <div class="left">
            <Card class="portraitText" :style="'background-image: url(static/img/userReport/'+this.getUserName()+'/'+this.getUserName()+'_规范格.png); background-size: cover'">
            </Card>
          </div>
          <div class="middle">
            <Card class="portraitText" :style="'background-image: url(static/img/userReport/'+this.getUserName()+'/'+this.getUserName()+'_错误格.png); background-size: cover'">
            </Card>
          </div>
          <div class="right">
            <Card class="portraitText" :style="'background-image: url(static/img/userReport/'+this.getUserName()+'/'+this.getUserName()+'_首次格.png); background-size: cover'">
            </Card>
          </div>
        </div>


      </card>


      <div><p><br></p></div>

      <Card  style="border-color: #ccccee; margin-top: 10px;border-style: solid; border-width: 4px;">
      <p class="emphasis" style="font-size:200">统计图表<br><br></p>
      <grid-layout
        :layout.sync="layout"
        :col-num="12"
        :row-height="40"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
        ref="chart"
      >

        <grid-item :x="layout[0].x" :y="layout[0].y" :w="layout[0].w" :h="layout[0].h" :static="layout[0].static" :i="layout[0].i" :key="layout[0].i" @resize="resize1">
          <v-chart :options="action" ref="chart1" />
        </grid-item>
        <grid-item :x="layout[1].x" :y="layout[1].y" :w="layout[1].w" :h="layout[1].h" :i="layout[1].i" :key="layout[1].i" @resize="resize2">
          <v-chart :options="hwComplete" ref="chart2"/>
        </grid-item>
        <grid-item :x="layout[2].x" :y="layout[2].y" :w="layout[2].w" :h="layout[2].h" :i="layout[2].i" :key="layout[2].i" @resize="resize3">
          <v-chart :options="score" ref="chart3"/>
        </grid-item>
        <grid-item :x="layout[3].x" :y="layout[3].y" :w="layout[3].w" :h="layout[3].h" :i="layout[3].i" :key="layout[3].i" @resize="resize4">
          <v-chart :options="scoreDetail" ref="chart4"/>
        </grid-item>
        <grid-item :x="layout[4].x" :y="layout[4].y" :w="layout[4].w" :h="layout[4].h" :i="layout[4].i" :key="layout[4].i" @resize="resize5">
          <v-chart :options="ability" ref="chart5"/>
        </grid-item>
        <grid-item :x="layout[5].x" :y="layout[5].y" :w="layout[5].w" :h="layout[5].h" :i="layout[5].i" :key="layout[5].i" @resize="resize6">
          <v-chart :options="codeStyle" ref="chart6"/>
        </grid-item>
        <grid-item :x="layout[6].x" :y="layout[6].y" :w="layout[6].w" :h="layout[6].h" :i="layout[6].i" :key="layout[6].i" @resize="resize7">
          <v-chart :options="codingScore" ref="chart7"/>
        </grid-item>
        <grid-item :x="layout[7].x" :y="layout[7].y" :w="layout[7].w" :h="layout[7].h" :i="layout[7].i" :key="layout[7].i" @resize="resize8">
          <v-chart :options="logicError" ref="chart8"/>
        </grid-item>
        <grid-item :x="layout[8].x" :y="layout[8].y" :w="layout[8].w" :h="layout[8].h" :i="layout[8].i" :key="layout[8].i" @resize="resize9">
          <v-chart :options="knowledge" ref="chart9"/>
        </grid-item>
      </grid-layout>
      </Card>
      </div>
      <Card style="border-color: #dff0d8; margin-top: 30px;border-style: solid; border-width: 4px;">


        <div class="flex-container">
          <div class="left">
            <p>{{$t('m.UserHomeSolved')}}</p>
            <p class="emphasis">{{profile.accepted_number}}</p>
          </div>
          <div class="middle">
            <p>{{$t('m.UserHomeserSubmissions')}}</p>
            <p class="emphasis">{{profile.submission_number}}</p>
          </div>
          <div class="right">
            <p>{{$t('m.UserHomeScore')}}</p>
            <p class="emphasis">{{profile.total_score}}</p>
          </div>
        </div>
      <div id="problems">
          <div v-if="problems.length">{{$t('m.List_Solved_Problems')}}
            <Poptip v-if="refreshVisible" trigger="hover" placement="right-start">
              <Icon type="ios-help-outline"></Icon>
              <div slot="content">
                <p>If you find the following problem id does not exist,<br> try to click the button.</p>
                <Button type="info" @click="freshProblemDisplayID">regenerate</Button>
              </div>
            </Poptip>
          </div>
          <p v-else>{{$t('m.UserHomeIntro')}}</p>
          <div class="btns">
            <div style="background-color: beige" class="problem-btn" v-for="problemID of problems" :key="problemID">
              <Button type="ghost" @click="goProblem(problemID)">{{problemID}}</Button>
            </div>
          </div>
        </div>
      </Card>
    </Card>
  </div>
</template>
<script src="qrcode/qrcode.js"></script>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import time from '@/utils/time'
  import api from '@oj/api'
  import stuCommonActionData from '../user/data/stu19_common_action'
  import stuPortrait from '../user/data/stu19_userPortrait.json'
  import stuScore from '../user/data/stu19_score'
  import testLayout from '../user/data/layout'
  import VueGridLayout from 'vue-grid-layout'
  import { graphic } from 'echarts/lib/export'
  import radarStrength from '../user/data/radarStrength.js'
  import codeStyleData from './data/stu19_codeStyle.js'
  import stuCodingScore from '../user/data/stu19_codingScore'
  import stuLogicError from '../user/data/stu19_logicError.js'
  import stuKnowledge from '../user/data/stu19_knowledge'
  import stuScoreDetail from '../user/data/stu19_scoreDetail'
  import stuLabels from '../user/data/stu19_labels'
  import ECharts from 'vue-echarts'
  import QRCode from 'qrcodejs2'

  export default {
    components: {
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      'v-chart': ECharts
    },
    data () {
      return {
        username: '',
        profile: {},
        problems: [],
        layout: testLayout,
        DiscriptionData: [],
        portrait: [],
        action: {},
        hwComplete: {},
        scoreDetail: {},
        ability: {},
        codeStyle: {},
        codingScore: {},
        logicError: {},
        knowledge: {},
        score: {},
        sessionTimes: 0, // 用户画像：回话时间
        codeHours: 0,  // 用户画像: 代码时间,
        scoreRank: '', // 用户画像：加权分数排名对应的描述
        avgSubmission: '', // 用户画像：平均每题提交次数的描述
        hwSpeedRank: '', // 用户画像: 作业完成平均速度
        labels: [],
        qrcodeVis: true // 二维码窗口可见性
      }
    },
    mounted () {
      this.getUserId()
      this.init()
      this.resize1()
      this.resize2()
      this.resize3()
      this.resize4()
      this.resize5()
      this.resize6()
      this.resize7()
      this.resize8()
      this.resize9()

      let _this = this
      // setTimeout(() => {
      //   console.log(this.$refs['chart'].$el.clientHeight)
      // }, 0)
      this.portrait = stuPortrait[_this.getUserId()]
      this.scoreRank = this.getScoreRank()
      this.avgSubmission = this.getAvgProlSubmRank()
      this.hwSpeedRank = this.getHwSpeedRank()
      this.labels = this.getLabels()
      this.codeHours = parseFloat(stuCommonActionData[8][_this.getUserId()])
      this.sessionTimes = stuCommonActionData[10][_this.getUserId()]
      this.commonSortByHour = this.sortByKey(stuCommonActionData, 8)
      this.commonSortBySpeed = this.sortByKey(stuCommonActionData, 7)
      this.codingSortByScore = this.sortByKey(stuCodingScore, 3)
      this.name_array1 = this.commonSortByHour[1].map((value) => {
        if (value !== _this.getUserName()) return ''
        else return value
      })
      this.name_array2 = this.commonSortBySpeed[1].map((value) => {
        if (value !== _this.getUserName()) return ''
        else return value
      })
      this.name_array3 = this.codingSortByScore[1].map((value) => {
        if (value !== _this.getUserName()) return ''
        else return value
      })
      this.ability = {
        title: {
          text: '',
          x: 'center'
        },
        tooltip: {},
        radar: {
          indicator: radarStrength[0].map(({name, max}) => {
            return {name, max}
          })
        },
        series: [
          {
            name: '能力值',
            type: 'radar',
            data: [{value: radarStrength[_this.getUserId()].map(({value}) => value)}]
          }
        ]
      }
      this.codeStyle = {
        title: {
          text: '代码不规范类型',
          x: 'center',
          subtext: stuLabels[_this.getUserId()][7].split(',')[1],
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          data: codeStyleData[0][_this.getUserId()],
          left: 'left',
          top: '75%'
          // show: false
        },
        series: [
          {
            name: '风格问题',
            type: 'pie',
            radius: '55%',
            center: ['50%', '45%'],
            data: codeStyleData[1][_this.getUserId()],
            label: {
              normal: {
                show: false,
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.action = {
        title: {
          text: 'OJ行为分析',
          subtext: this.getActionTitle2(),
          left: 'center'
        },
        legend: {
          // '点击ranking次数'去掉
          data: ['在线小时数', '在线会话数'],
          left: 'center',
          top: '92%'
          // textStyle: {
          //   fontSize: 20
          // }
        },
        xAxis: {
        },
        yAxis: {
          type: 'category',
          data: _this.name_array1,
          axisLabel: {
            interval: 0
          }
        },
        tooltip: {},
        series: [
          // {
          //   name: '点击ranking次数',
          //   type: 'bar',
          //   data: stuCommonActionData[6]
          // },
          {
            name: '在线小时数',
            type: 'bar',
            data: _this.commonSortByHour[8]
          },
          {
            name: '在线会话数',
            type: 'bar',
            data: _this.commonSortByHour[10]
          }
        ],
        animationDuration: 2000,
        grid: [{
          left: '15%',
          bottom: '15%',
          top: '15%',
          right: '15%'
        }]
      }
      this.hwComplete = {
        title: {
          text: '作业完成情况',
          subtext: stuLabels[_this.getUserId()][3].split(',')[1],
          left: 'center'
        },
        legend: {
          data: ['作业完成速度(小时)', '习题完成数', '习题完成频率'],
          left: 'center',
          top: '92%'
        },
        xAxis: {
          type: 'category',
          data: this.name_array2,
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {},
        tooltip: {},
        series: [
          {
            name: '作业完成速度(小时)',
            type: 'bar',
            data: this.commonSortBySpeed[7]
          },
          {
            name: '习题完成数',
            type: 'bar',
            data: _this.commonSortBySpeed[14]
          },
          {
            name: '习题完成频率',
            type: 'bar',
            data: _this.commonSortBySpeed[15]
          }
        ],
        animationDuration: 2000,
        grid: [{
          left: '15%',
          bottom: '15%',
          top: '15%',
          right: '15%'
        }]
      }
      this.score = {
        title: {
          text: '作业考试成绩分析',
          subtext: '平时成绩: ' + stuScore[_this.getUserId()][0] + ', 考试成绩: ' + stuScore[_this.getUserId()][1],
          left: 'center'
        },
        xAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          scale: true,
          name: '平时成绩'
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          scale: true,
          name: '考试成绩'
        },
        series: [
          {
            name: '考试成绩',
            data: stuScore,
            type: 'scatter',
            symbolSize (data) {
              return 20
            },
            label: {
              emphasis: {
                show: false,
                formatter ({ data }) {
                  return data[3]
                },
                position: 'top'
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: 5,
                color: new graphic.RadialGradient(0.4, 0.3, 1, [
                  {
                    offset: 0,
                    color: 'rgb(251, 118, 123)'
                  },
                  {
                    offset: 1,
                    color: 'rgb(204, 46, 72)'
                  }
                ])
              }
            }
          },
          {
            name: '你的成绩',
            data: [stuScore[_this.getUserId()]],
            type: 'scatter',
            symbolSize (data) {
              return 20
            },
            label: {
              emphasis: {
                show: false,
                formatter ({ data }) {
                  return data[3]
                },
                position: 'top'
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(25, 100, 150, 0.5)',
                shadowOffsetY: 5,
                color: new graphic.RadialGradient(0.4, 0.3, 1, [
                  {
                    offset: 0,
                    color: 'rgb(129, 227, 238)'
                  },
                  {
                    offset: 1,
                    color: 'rgb(25, 183, 207)'
                  }
                ])
              }
            }
          }
        ],
        grid: [{
          left: '15%',
          bottom: '15%',
          top: '15%',
          right: '15%'
        }]
      }
      this.codingScore = {
        title: {
          text: '代码效率分析',
          subtext: this.getCodingTitle2(),
          left: 'center'
        },
        legend: {
          data: ['首次提交的正确率', '平均正确率', '每题平均递交次数'],
          left: 'center',
          top: '92%'
        },
        xAxis: {
        },
        yAxis: {
          type: 'category',
          data: this.name_array3,
          axisLabel: {
            interval: 0
          }
        },
        tooltip: {},
        series: [
          {
            name: '首次提交的正确率',
            type: 'bar',
            data: _this.codingSortByScore[3]
          },
          {
            name: '平均正确率',
            type: 'bar',
            data: _this.codingSortByScore[4]
          },
          {
            name: '每题平均递交次数',
            type: 'bar',
            data: _this.codingSortByScore[2]
          }
        ],
        animationDuration: 2000,
        grid: [{
          left: '15%',
          bottom: '15%',
          top: '15%',
          right: '15%'
        }]
      }
      this.logicError = {
        title: {
          text: '易犯错类型',
          x: 'center',
          subtext: stuLabels[_this.getUserId()][8].split(',')[1],
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}次 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: '75%',
          data: stuLogicError[0][_this.getUserId()]
          // show: false
        },
        series: [
          {
            name: '错误类型',
            type: 'pie',
            radius: '55%',
            center: ['50%', '45%'],
            data: stuLogicError[1][_this.getUserId()],
            label: {
              normal: {
                show: false,
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.knowledge = {
        title: {
          text: '知识点掌握',
          subtext: stuLabels[_this.getUserId()][6].split(',')[1],
          left: 'center'
        },
        legend: {
          data: ['知识点掌握程度'],
          left: 'center',
          top: '92%'
        },
        xAxis: {
          type: 'category',
          data: stuKnowledge[_this.getUserId()][0]
        },
        yAxis: {},
        tooltip: {},
        series: [
          {
            name: '知识点掌握程度',
            type: 'bar',
            data: stuKnowledge[_this.getUserId()][1]
          }
        ],
        animationDuration: 2000,
        grid: [{
          left: '15%',
          bottom: '15%',
          top: '15%',
          right: '15%'
        }]
      }
      this.scoreDetail = {
        title: {
          text: '成绩变化趋势',
          subtext: this.getScoreTitle(),
          left: 'center'
        },
        legend: {
          data: ['成绩曲线'],
          left: 'center',
          top: '92%'
        },
        xAxis: {
          type: 'category', data: stuScoreDetail[0]
        },
        yAxis: {},
        tooltip: {},
        series: [
          {
            name: '成绩曲线',
            type: 'line',
            data: stuScoreDetail[1][_this.getUserId()]
          }
        ],
        animationDuration: 2000,
        grid: [{
          left: '15%',
          bottom: '15%',
          top: '15%',
          right: '15%'
        }]
      }
    },
    methods: {
      ...mapActions(['changeDomTitle']),
      init () {
        this.username = this.$route.query.username
        api.getUserInfo(this.username).then(res => {
          this.changeDomTitle({title: res.data.data.user.username})
          this.profile = res.data.data
          this.getSolvedProblems()
          this.getDiscriptionData()
          let registerTime = time.utcToLocal(this.profile.user.create_time, 'YYYY-MM-D')
          console.log('The guy registered at ' + registerTime + '.')
        })
        // console.log('李云帆' in stuCodingScore[1])
        this.ifUserPortrait()
        if (this.ifUserPortrait()) {
          this.getQRCode()
        }
        // var specialUser = stuCodingScore[1]
        // console.log(specialUser)
        // console.log(this.getUserName())
      },
      ifUserPortrait () {
        var userName = this.getUserName()
        for (var i = 0; i < 29; i++) {
          if (userName === stuCodingScore[1][i]) {
            return true
          }
        }
        return false
      },
      showQRcode () {
        this.qrcodeVis = true
        this.$Message.info('二维码他出现了！！')
      },
      closeQRcode () {
        this.qrcodeVis = false
        this.$Message.info('二维码他不见了！！')
      },
      getScoreRank () {
        // console.log(stuScore)
        var userId = this.getUserId()
        var score = parseFloat(stuScore[userId][5])
        var rankScore = 1
        for (let i = 0; i < 29; i++) {
          if (score < parseFloat(stuScore[i][5])) rankScore++
        }
        rankScore = rankScore / 29
        if (rankScore <= 0.33) return '恭喜你已经打通任督二脉！'
        else if (rankScore <= 0.66) return '你已内力浑厚，打通任督二脉指日可待'
        else return '你的内功修为尚浅，还需勤加练习～'
      },
      getAvgProlSubmRank () {
        var rank = 1
        var userId = this.getUserId()
        var submissionTimes = parseFloat(stuCodingScore[2][userId])
        for (let i = 0; i < 29; i++) {
          var temp = parseFloat(stuCodingScore[2][i])
          if (submissionTimes > temp) rank++
        }
        rank = rank / 29
        if (rank <= 0.33) return '四两拨千斤!'
        else if (rank <= 0.66) return '一力降十会!'
        else return '四两拨千斤!'
      },
      getHwSpeedRank () {
        var rank = 1
        var userId = this.getUserId()
        var hwSpeedRank = parseFloat(stuCommonActionData[16][userId])
        for (let i = 0; i < 29; i++) {
          var temp = parseFloat(stuCommonActionData[16][i])
          if (hwSpeedRank > temp) rank++
        }
        rank = rank / 29
        if (rank <= 0.33) return '天下武功，无坚不摧，唯快不破!'
        else if (rank <= 0.66) return '重剑无锋，大巧不工!'
        else return '他强由他强，清风拂山岗!'
      },
      downReport (url) {
        var name = this.getUserName()
        // name = encodeURIComponent(name)
        // name = Buffer.from(name).toString('base64')
        const a = document.createElement('a')
        a.setAttribute('download', this.getUserName() + '的报告.zip')
        a.setAttribute('target', '_blank')
        a.setAttribute('href', 'static/img/userReport/' + name + '.zip')
        a.click()
      },
      getUserGender () {
        for (let i = 0; i < stuCommonActionData[1].length; i += 1) {
          if (this.user.username === stuCommonActionData[1][i]) {
            return stuCommonActionData[2][i]
          }
        }
        return 'unknown'
      },
      getUserId () {
        if (window.localStorage.getItem('userId')) {
          return window.localStorage.getItem('userId')
        }
        var res = 4
        for (let i = 0; i < stuCommonActionData[1].length; i += 1) {
          if (this.user.username === stuCommonActionData[1][i]) {
            res = i
          }
        }
        window.localStorage.setItem('userId', res)
        return res
      },
      getUserName () {
        if (window.localStorage.getItem('userName')) {
          return window.localStorage.getItem('userName')
        }
        window.localStorage.setItem('userName', this.user.username)
        return window.localStorage.getItem('userName')
      },
      getUserLanguage () {
        for (let i = 0; i < stuCommonActionData[1].length; i += 1) {
          if (this.user.username === stuCommonActionData[1][i]) {
            return stuCommonActionData[4][i]
          }
        }
        return 'unknown'
      },
      resize1 () {
        setTimeout(() => {
          this.$refs[`chart1`].resize()
        }, 0)
      },
      resize2 () {
        setTimeout(() => {
          this.$nextTick(_ => {
            this.$refs[`chart2`].resize()
          })
        }, 0)
      },
      resize3 () {
        setTimeout(() => {
          this.$nextTick(_ => {
            this.$refs[`chart3`].resize()
          })
        }, 0)
      },
      resize4 () {
        setTimeout(() => {
          this.$nextTick(_ => {
            this.$refs[`chart4`].resize()
          })
        }, 0)
      },
      resize5 () {
        setTimeout(() => {
          this.$nextTick(_ => {
            this.$refs[`chart5`].resize()
          })
        }, 0)
      },
      resize6 () {
        setTimeout(() => {
          this.$nextTick(_ => {
            this.$refs[`chart6`].resize()
          })
        }, 0)
      },
      resize7 () {
        setTimeout(() => {
          this.$nextTick(_ => {
            this.$refs[`chart7`].resize()
          })
        }, 0)
      },
      resize8 () {
        setTimeout(() => {
          this.$nextTick(_ => {
            this.$refs[`chart8`].resize()
          })
        }, 0)
      },
      resize9 () {
        setTimeout(() => {
          this.$nextTick(_ => {
            this.$refs[`chart9`].resize()
          })
        }, 0)
      },
      getActionTitle2 () {
        let userId = this.getUserId()
        let a = stuLabels[userId][1].split(',')[1]
        let b = stuLabels[userId][2].split(',')[1]
        return a + ',' + b
      },
      getActionTitle () {
        let userId = this.getUserId()
        let hours = stuCommonActionData[8]
        let userHour = parseFloat(hours[userId])
        if (userHour < 30) return '一切随缘'
        let mean = 0.0
        for (let i = 0; i < 29; i++) {
          mean = mean + parseFloat(hours[i])
        }
        mean /= 29
        if (userHour < mean) return '佛系青年'
        else return '肝帝'
      },
      getQRCode () {
        var name = this.getUserName()
        name = encodeURIComponent(name)
        // name = Buffer.from(name).toString('base64')106.75.229.26 106.75.252.219
        name = 'http://106.75.252.219/static/img/haibao/' + name + '.png'
        // eslint-disable-next-line no-new
        new QRCode('qrcode', {
          text: name, // 二维码地址
          width: 100,
          height: 100
        })
      },
      getHwTitle () {
        let userId = this.getUserId()
        let hwSpeed = stuCommonActionData[7]
        let userSpeed = parseFloat(hwSpeed[userId])
        if (userSpeed < 100) {
          return '特快枪手'
        } else if (userId < 200) {
          return '快枪手'
        } else if (userId < 400) {
          return '慢枪手'
        } else {
          return '特慢枪手'
        }
      },
      getScoreTitle () {
        let userId = this.getUserId()
        let userScore = parseFloat(stuScore[userId][5])
        if (userScore >= 3.5) {
          return '考场王者'
        } else if (userScore >= 3.0) {
          return '考场达人'
        } else if (userScore >= 2.5) {
          return '考场新秀'
        } else {
          return '考场新人'
        }
      },
      getCodingTitle2 () {
        let userId = this.getUserId()
        let a = stuLabels[userId][4].split(',')[1]
        let b = stuLabels[userId][5].split(',')[1]
        return a + ',' + b
      },
      getCodingTitle () {
        let userId = this.getUserId()
        let acTimes = parseFloat(stuCodingScore[2][userId])
        if (acTimes <= 1.8) {
          return '神斗士'
        } else if (acTimes <= 1.96) {
          return '黄金圣斗士'
        } else if (acTimes <= 2.22) {
          return '白银圣斗士'
        } else return '青铜圣斗士'
      },
      getKnowledgeTitle () {
        let userId = this.getUserId()
        let userKnowledge = stuKnowledge[userId][1]
        let userKnowName = stuKnowledge[userId][0]
        let ret = ''
        for (let i = 0; i < 3; i++) {
          let curKnowledge = parseFloat(userKnowledge[i])
          let curKnowName = userKnowName[i]
          ret += curKnowName
          if (curKnowledge < 0.5) {
            ret += '小白 '
          } else if (curKnowledge < 0.8) {
            ret += '进阶 '
          } else {
            ret += '达人 '
          }
        }
        return ret
      },
      getSolvedProblems () {
        let ACMProblems = this.profile.acm_problems_status.problems || {}
        let OIProblems = this.profile.oi_problems_status.problems || {}
        // todo oi problems
        let ACProblems = []
        for (let problems of [ACMProblems, OIProblems]) {
          Object.keys(problems).forEach(problemID => {
            if (problems[problemID]['status'] === 0) {
              ACProblems.push(problems[problemID]['_id'])
            }
          })
        }
        ACProblems.sort()
        this.problems = ACProblems
      },
      goProblem (problemID) {
        if (problemID[0] === '1') {
          this.$router.push({name: 'problem-details', params: {problemID: problemID}})
        } else {
          this.$router.push({
            name: 'contest-problem-details',
            params: {
              contestID: problemID.split('-')[0],
              problemID: problemID.split('-')[1]
            }
          })
        }
      },
      freshProblemDisplayID () {
        api.freshDisplayID().then(res => {
          this.$success('Update successfully')
          this.init()
        })
      },
      getStyleTranslation (codeStyle) {
        let trans = {'whitespace/tab': '制表符', 'whitespace/braces': '空行', 'whitespace/indent': '缩进', 'whitespace/operators': '操作符', 'whitespace/comma': '注释', 'whitespace/newline': '新起行', 'whitespace/ending_newline': '结尾新行', 'whitespace/semicolon': '分号', 'whitespace/end_of_line': '行末', 'build/include': '头文件声明', 'readability/check': '字符串', 'whitespace/forcolon': '冒号', 'readability/utf8': '字符编码', 'runtime/arrays': '数组', 'runtime/memset': '内存申请', 'whitespace/parens': '括号', 'whitespace/blank_line': '空白行'}

        return trans[codeStyle]
      },
      getLabels () {
        let userId = this.getUserId()
        let label = []
        label.push(stuLabels[userId][1].split(',')[1])
        label.push(stuLabels[userId][2].split(',')[1])
        label.push(stuLabels[userId][3].split(',')[1])
        label.push(stuLabels[userId][4].split(',')[1])
        label.push(stuLabels[userId][5].split(',')[1])
        label.push(stuLabels[userId][6].split(',')[1])
        label.push(stuLabels[userId][7].split(',')[1])
        label.push(stuLabels[userId][8].split(',')[1])
        return label
      },
      getDiscriptionData () {
        let userId = this.getUserId()
        let DiscriptionData = []

        DiscriptionData.push(this.getActionTitle())
        DiscriptionData.push(this.getHwTitle())
        DiscriptionData.push(this.getScoreTitle())
        DiscriptionData.push(this.getCodingTitle())

        DiscriptionData.push(parseFloat(stuCodingScore[3][userId]).toFixed(2))
        DiscriptionData.push(parseFloat(stuCodingScore[4][userId]).toFixed(2))
        DiscriptionData.push(parseFloat(stuCodingScore[2][userId]).toFixed(2))

        DiscriptionData.push(stuKnowledge[userId][0][0])
        DiscriptionData.push(stuKnowledge[userId][0][1])
        DiscriptionData.push(stuKnowledge[userId][0][2])
        DiscriptionData.push(parseFloat(stuKnowledge[userId][1][0]).toFixed(2))
        DiscriptionData.push(parseFloat(stuKnowledge[userId][1][1]).toFixed(2))
        DiscriptionData.push(parseFloat(stuKnowledge[userId][1][2]).toFixed(2))

        DiscriptionData.push(stuKnowledge[userId][0][16])
        DiscriptionData.push(stuKnowledge[userId][0][15])
        DiscriptionData.push(stuKnowledge[userId][0][14])
        DiscriptionData.push(parseFloat(stuKnowledge[userId][1][16]).toFixed(2))
        DiscriptionData.push(parseFloat(stuKnowledge[userId][1][15]).toFixed(2))
        DiscriptionData.push(parseFloat(stuKnowledge[userId][1][14]).toFixed(2))

        DiscriptionData.push(this.getStyleTranslation(codeStyleData[0][userId][0]))
        DiscriptionData.push(this.getStyleTranslation(codeStyleData[0][userId][1]))
        DiscriptionData.push(this.getStyleTranslation(codeStyleData[0][userId][2]))

        DiscriptionData.push(stuLogicError[0][userId][0])
        DiscriptionData.push(stuLogicError[1][userId][0]['value'])
        DiscriptionData.push(stuLogicError[0][userId][1])
        DiscriptionData.push(stuLogicError[1][userId][1]['value'])
        DiscriptionData.push(stuLogicError[0][userId][2])
        DiscriptionData.push(stuLogicError[1][userId][2]['value'])

        DiscriptionData.push(parseFloat(stuCommonActionData[7][userId]).toFixed(0))
        DiscriptionData.push((parseFloat(stuCommonActionData[16][userId])).toFixed(0))
        DiscriptionData.push((parseFloat(stuCommonActionData[14][userId]) / 120).toFixed(1))

        this.DiscriptionData = DiscriptionData
      },

      sortByKey (arr, id) {
        let newArr = []
        let index = []
        for (let i = 0; i < arr[0].length; i++) {
          index[i] = i
        }
        for (let i = 0; i < arr[0].length; i++) {
          for (let j = i + 1; j < arr[0].length; j++) {
            if (parseFloat(arr[id][index[i]]) > parseFloat(arr[id][index[j]])) {
              index[i] ^= index[j]
              index[j] ^= index[i]
              index[i] ^= index[j]
            }
          }
        }
        // index.sort(function (a, b) {
        //   return parseFloat(arr[id][a]) > parseFloat(arr[id][b])
        // })
        // console.log(index)
        for (let i = 0; i < arr.length; i++) {
          newArr[i] = []
          for (let j = 0; j < arr[0].length; j++) {
            newArr[i][j] = arr[i][index[j]]
          }
        }
        // console.log(newArr)
        return newArr
      },
      hideName (name, arr) {
        let ret = []
        // console.log(name, arr)
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === name) ret[i] = name
          else ret[i] = ''
        }
        // console.log(ret)
        return ret
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'user']),
      refreshVisible () {
        if (!this.username) return true
        if (this.username && this.username === this.$store.getters.user.username) return true
        return false
      }
    },
    watch: {
      '$route' (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.init()
        }
      }
    }
  }
</script>


<style lang="less" scoped>
  .container {
    position: relative;
    width: 99%;
    margin: 170px auto;
    text-align: center;
    p {
      margin-top: 8px;
      margin-bottom: 8px;
    }
    .avatar-container {
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      z-index: 1;
      top: -90px;
      .avatar {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        box-shadow: 0 1px 1px 0;
      }
    }
    .emphasis {
      font-size: 20px;
      font-weight: 600;
    }
    .split {
      margin: 0px auto;
      width: 98%;
    }
    .flex-container {
      margin-top: 30px;
      padding: auto 20px;
      .left {
        flex: 1 1;
      }
      .middle {
        flex: 1 1;
        border-left: 1px solid #999;
        border-right: 1px solid #999;
      }
      .right {
        flex: 1 1;
      }
    }
    #problems {
      margin-top: 40px;
      padding-left: 30px;
      padding-right: 30px;
      font-size: 18px;
      .btns {
        margin-top: 15px;
        .problem-btn {
          display: inline-block;
          margin: 5px;
        }
      }
    }
    #icons {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translate(-50%);
      .icon {
        padding-left: 20px;
      }
    }
  }

  .echarts {
    width: 100%;
    height: 100%;
  }

  #content {
    width: 100%;
  }

  .vue-grid-layout {
    background: #eee;
  }

  .layoutJSON {
    background: #ddd;
    border: 1px solid black;
    margin-top: 10px;
    padding: 10px;
  }

  .eventsJSON {
    /*background: #ddd;*/
    border: 1px solid black;
    margin-top: 10px;
    padding: 10px;
    height: 100px;
    overflow-y: scroll;
  }

  .columns {
    -moz-columns: 120px;
    -webkit-columns: 120px;
    columns: 120px;
  }

  .vue-resizable-handle {
    z-index: 5000;
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 0;
    right: 0;
    background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
    background-position: bottom right;
    padding: 0 3px 3px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: se-resize;
  }

  .vue-grid-item:not(.vue-grid-placeholder) {
    background: #ffffff;
    border: 1px solid #da0d0d00;
    border-top: 4px solid #ccc;
  }

  .vue-grid-item.resizing {
    opacity: 0.9;
  }

  .vue-grid-item.static {
    background: #cce;
  }

  .vue-grid-item .text {
    font-size: 24px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 24px;
  }

  .vue-grid-item .minMax {
    font-size: 12px;
  }

  .vue-grid-item .add {
    cursor: pointer;
  }

  .vue-draggable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
    background-position: bottom right;
    padding: 0 8px 8px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
  }
  .portraitText{
    width: 310px;
    height: 310px;
    margin: 0 auto;
  }
  .portraitData1{
    font-size: larger;
    color: #3399ff;
  }
  .portraitData2{
    font-size: larger;
    color: #00cc66;
  }
  .portraitData{
    font-size: larger;
  }
  #qrcodeDiv{
    margin-top: 20px;
    display: inline-block;
    text-align: center;
  }
</style>
