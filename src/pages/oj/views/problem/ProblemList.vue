<template>
  <Row type="flex" :gutter="18">
    <Col :span=19>
    <Panel shadow>
      <div slot="title">Problem List</div>
      <div slot="extra">
        <ul class="filter">
          <li>
            <Dropdown @on-click="filterByDifficulty">
              <span>{{query.difficulty === '' ? 'Difficulty' : query.difficulty}}
                <Icon type="arrow-down-b"></Icon>
              </span>
              <Dropdown-menu slot="list">
                <Dropdown-item name="">All</Dropdown-item>
                <Dropdown-item name="Low">Low</Dropdown-item>
                <Dropdown-item name="Mid">Mid</Dropdown-item>
                <Dropdown-item name="High">High</Dropdown-item>
              </Dropdown-menu>
            </Dropdown>
          </li>
          <li>
            <i-switch size="large" @on-change="handleTagsVisible">
              <span slot="open">Tags</span>
              <span slot="close">Tags</span>
            </i-switch>
          </li>
          <li>
            <Input v-model="query.keyword"
                   @on-enter="filterByKeyword"
                   @on-click="filterByKeyword"
                   placeholder="keyword"
                   icon="ios-search-strong"/>
          </li>
          <li>
            <Button type="info" @click="onReset">
              <Icon type="refresh"></Icon>
              Reset
            </Button>
          </li>
        </ul>
      </div>
      <Table style="width: 100%; font-size: 16px;"
             :columns="problemTableColumns"
             :data="problemList"
             :loading="loadings.table"
             disabled-hover></Table>
    </Panel>
    <Pagination :total="total" :page-size="limit" @on-change="pushRouter" :current.sync="query.page"></Pagination>
    </Col>

    <Col :span="5">
      <Panel :padding="10">
        <div slot="title" class="taglist-title">用户推荐</div>
        <Button v-for="user in recommendList.user"
                @click="pickUser(user)"
                :key="user"
                type="ghost"
                shape="circle"
                class="tag-btn">{{user}}
        </Button>

        <Button long id="pick-one1" @click="pickone">
          <Icon type="shuffle"></Icon>
          Pick one
        </Button>
      </Panel>

      <Panel :padding="10">
        <div slot="title" class="taglist-title">题目推荐</div>
        <Button v-for="problem in recommendList.problems_info"
                @click="pickProblem(problem['_id'], problem['contest_id'])"
                :key="problem"
                type="ghost"
                shape="circle"
                class="tag-btn">{{problem['title']}}
        </Button>

        <Button long id="pick-one2" @click="pickone">
          <Icon type="shuffle"></Icon>
          Pick one
        </Button>
      </Panel>

      <Panel :padding="10">
        <div slot="title" class="taglist-title">知识点掌握</div>
        <p v-for="(prob, index) in knowledgeList['res']">
          {{knowledgeList['name'][index]}}
        <Progress :percent="prob * 100.0" hide-info>
        </Progress>
        </p>
      </Panel>

    <Panel :padding="10">
      <div slot="title" class="taglist-title">Tags</div>
      <Button v-for="tag in tagList"
              :key="tag.name"
              @click="filterByTag(tag.name)"
              type="ghost"
              :disabled="query.tag === tag.name"
              shape="circle"
              class="tag-btn">{{tag.name}}
      </Button>

      <Button long id="pick-one" @click="pickone">
        <Icon type="shuffle"></Icon>
        Pick one
      </Button>
    </Panel>

    <Spin v-if="loadings.tag" fix size="large"></Spin>
    </Col>
  </Row>
</template>

<script>
  import { mapGetters } from 'vuex'
  import api from '@oj/api'
  import utils from '@/utils/utils'
  import { ProblemMixin } from '@oj/components/mixins'
  import Pagination from '@oj/components/Pagination'

  export default {
    name: 'ProblemList',
    mixins: [ProblemMixin],
    components: {
      Pagination
    },
    data () {
      return {
        tagList: [],
        recommendList: [],
        knowledgeList: [],
        problemTableColumns: [
          {
            title: '#',
            key: '_id',
            width: 80,
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    this.$router.push({name: 'problem-details', params: {problemID: params.row._id}})
                    // 行为类别：查看 动作：查看题目
                    // eslint-disable-next-line no-undef
                    sendStatement(this.user.username ? this.user.username : 'null', this.user.email ? this.user.email : 'null@null.com', 'clickCommonProblem', 'http://clickCommonProblem', params.row._id, 'http://commonProblemId')
                    // console.log('sendTagStatement success!')
                  }
                },
                style: {
                  padding: '2px 0'
                }
              }, params.row._id)
            }
          },
          {
            title: 'Title',
            width: 400,
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    this.$router.push({name: 'problem-details', params: {problemID: params.row._id}})
                    // 行为类别：查看 动作：查看题目
                    this.$nextTick(function () {
                      // eslint-disable-next-line no-undef
                      sendStatement(this.user.username ? this.user.username : 'null', this.user.email ? this.user.email : 'null@null.com', 'clickCommonProblem', 'http://clickCommonProblem', params.row._id, 'http://commonProblemId')
                    }, 3000
                    // console.log('sendTagStatement success!')
                    )
                  }
                },
                style: {
                  padding: '2px 0',
                  overflowX: 'auto',
                  textAlign: 'left',
                  width: '100%'
                }
              }, params.row.title)
            }
          },
          {
            title: 'Level',
            render: (h, params) => {
              let t = params.row.difficulty
              let color = 'blue'
              if (t === 'Low') color = 'green'
              else if (t === 'High') color = 'yellow'
              return h('Tag', {
                props: {
                  color: color
                }
              }, params.row.difficulty)
            }
          },
          {
            title: 'Total',
            key: 'submission_number'
          },
          {
            title: 'AC Rate',
            render: (h, params) => {
              return h('span', this.getACRate(params.row.accepted_number, params.row.submission_number))
            }
          }
        ],
        problemList: [],
        limit: 20,
        total: 0,
        loadings: {
          table: true,
          tag: true
        },
        routeName: '',
        query: {
          keyword: '',
          difficulty: '',
          tag: '',
          page: 1
        }
      }
    },
    mounted () {
      this.init()
      this.getRecommendList()
      this.getKnowledgeList()
    },
    methods: {
      getUserId () {
        if (window.localStorage.getItem('userId')) {
          return window.localStorage.getItem('userId')
        }
        var res = this.user.id
        window.localStorage.setItem('userId', this.user.id)
        return res
      },
      init (simulate = false) {
        this.routeName = this.$route.name
        let query = this.$route.query
        this.query.difficulty = query.difficulty || ''
        this.query.keyword = query.keyword || ''
        this.query.tag = query.tag || ''
        this.query.page = parseInt(query.page) || 1
        if (this.query.page < 1) {
          this.query.page = 1
        }
        if (!simulate) {
          this.getTagList()
        }
        this.getProblemList()
      },
      pushRouter () {
        this.$router.push({
          name: 'problem-list',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getProblemList () {
        let offset = (this.query.page - 1) * this.limit
        this.loadings.table = true
        api.getProblemList(offset, this.limit, this.query).then(res => {
          this.loadings.table = false
          this.total = res.data.data.total
          this.problemList = res.data.data.results
          if (this.isAuthenticated) {
            this.addStatusColumn(this.problemTableColumns, res.data.data.results)
          }
        }, res => {
          this.loadings.table = false
        })
      },
      getTagList () {
        api.getProblemTagList().then(res => {
          this.tagList = res.data.data
          this.loadings.tag = false
        }, res => {
          this.loadings.tag = false
        })
      },
      getRecommendList () {
        api.getRecommendList(this.getUserId(), 5, 7).then(res => {
          this.recommendList = res.data.data
        }, res => {}
        )
      },
      getKnowledgeList () {
        api.getDktList(1).then(res => {
          this.knowledgeList = res.data.data
        })
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
      filterByTag (tagName) {
        this.query.tag = tagName
        this.query.page = 1
        this.pushRouter()
      },
      filterByDifficulty (difficulty) {
        this.query.difficulty = difficulty
        this.query.page = 1
        this.pushRouter()
      },
      filterByKeyword () {
        this.query.page = 1
        this.pushRouter()
      },
      handleTagsVisible (value) {
        if (value) {
          this.problemTableColumns.push(
            {
              title: 'Tags',
              align: 'center',
              render: (h, params) => {
                let tags = []
                params.row.tags.forEach(tag => {
                  tags.push(h('Tag', {}, tag))
                })
                return h('div', {
                  style: {
                    margin: '8px 0'
                  }
                }, tags)
              }
            })
        } else {
          this.problemTableColumns.splice(this.problemTableColumns.length - 1, 1)
        }
      },
      onReset () {
        this.$router.push({name: 'problem-list'})
      },
      pickone () {
        api.pickone().then(res => {
          this.$success('Good Luck')
          this.$router.push({name: 'problem-details', params: {problemID: res.data.data}})
        })
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'user'])
    },
    watch: {
      '$route' (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.init(true)
        }
      },
      'isAuthenticated' (newVal) {
        if (newVal === true) {
          this.init()
          this.getRecommendList()
          this.getKnowledgeList()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .taglist-title {
    margin-left: -10px;
    margin-bottom: -10px;
  }

  .tag-btn {
    margin-right: 5px;
    margin-bottom: 10px;
  }

  #pick-one {
    margin-top: 10px;
  }
</style>
