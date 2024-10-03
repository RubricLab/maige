import { SerpAPI } from '@langchain/community/tools/serpapi'
import { expect, test } from 'bun:test'
import { z } from 'zod'

test('Bun test runner', () => {
	// This is arbitrary. Could just return true.
	expect(Bun.version).toInclude('1.')
})

test('SERP API', async () => {
	const serp = new SerpAPI()
	const res = await serp.call("today's weather in san francisco")

	const weather = JSON.parse(res)

	expect(weather.location).toBe('San Francisco, CA')
})

test('Zod parser', () => {
	const dynamicFieldsSchema = z.record(z.string(), z.any())
	const testObj = {
		field1: 'val',
		field2: ['val2', 'val3'],
		field3: {
			field4: 'val4'
		}
	}
	const validObj = dynamicFieldsSchema.parse(testObj)

	expect(validObj).toHaveProperty('field1')
	expect(validObj?.field3?.field4).toBe('val4')
})

test.todo('E2E', () => {
	console.log('It should pass a sample issue to engineer() and have it appropriately labelled')
})
