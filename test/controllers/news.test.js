const test = require('ava')
const supertest = require('supertest')
const app = require('../../app')

const server = app.listen()
const request = supertest.agent(server)

test('News list', async t => {
  const res = await request
    .get('/api/news/list')

  t.plan(4)

  t.is(res.status, 200)
  t.is(res.type, 'application/json')
  t.truthy(Array.isArray(res.body.list.docs))

  if (res.body.list.docs.length > 0) {
    t.truthy(res.body.list.docs[0].title)
  } else {
    t.pass('News list is empty')
  }
})

test('News fails to find one', async (t) => {
  const res = await request
    .get('/api/news/-1')

  t.is(res.status, 400)
  t.is(res.type, 'application/json')

  t.truthy(res.body.error)
})

test.after.always('close server', t => {
  server.close()
})
