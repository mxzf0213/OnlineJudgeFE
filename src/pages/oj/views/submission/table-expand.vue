<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
  span{font-size: 14px;font-weight:bold;}
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col>
        <span class="expand-key">标准输入:</span>
        <Card :bordered="False"><pre>{{row.std_in}}</pre></Card>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col>
        <span class="expand-key">标准输出:</span>
        <Card :bordered="False"><pre>{{row.std_out}}</pre></Card>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col>
        <span class="expand-key">你的输出:</span>
        <Card :bordered="False"><pre>{{row.output}}</pre></Card>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col>
        <span class="expand-key">系统信息:</span>
        <Card :bordered="False">Exited with return code {{row.exit_code}}</Card>
      </Col>
    </Row>
  </div>
</template>
<script>
  export default {
    props: {
      row: Object
    }
  }
</script>
