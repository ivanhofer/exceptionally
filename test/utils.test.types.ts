/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	exception,
	type ExtractDataType,
	type ExtractExceptionType,
	type ExtractSuccessType,
	success,
} from 'exceptionally'

{
	const r = Math.random() > 0.5 ? success('') : exception(0)

	const rType: string | number = r()

	type ExtractedDataType = ExtractDataType<typeof r>
	const dString: ExtractedDataType = 'hello'
	const dNumber: ExtractedDataType = 123
	// @ts-expect-error should be of type `string | number`
	const dWrongNull: ExtractedDataType = null

	const sType: string = (r as ExtractSuccessType<typeof r>)()
	// @ts-expect-error should be of type `string`
	const sWrongType: number = (r as ExtractSuccessType<typeof r>)()

	const eType: number = (r as ExtractExceptionType<typeof r>)()
	// @ts-expect-error should be of type `number`
	const eWrongType: string = (r as ExtractExceptionType<typeof r>)()
}
