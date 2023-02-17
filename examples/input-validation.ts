// ! NOTE: You need to clone this repository locally and open it in your IDE (VS Code) to see typesafety in action.

import { exception, success } from 'exceptionally'

// --------------------------------------------------------------------------------------------------------------------

const validate = <Data>(data: Data, validator: (data: Data) => true | string) => {
	const isOk = validator(data)
	if (isOk === true) return success(data)

	return exception(isOk)
}

// --------------------------------------------------------------------------------------------------------------------

type Post = {
	author: string
	title: string
	content: string
}

const postValidator = (post: Post) => {
	// return meaningful error messages when something is invalid
	if (!post.author) return '"author" missing'

	if (!post.title) return '"title" missing'
	if (post.title.length > 120) return '"title" must be shorter than 120 characters'

	if (!post.content) return '"content" missing'
	if (post.title.length < 500) return '"content" must contain at least 500 characters'

	// return `true` when validation passes
	return true
}

const savePost = async (post: Post) => {
	const validationResult = validate(post, postValidator)
	if (validationResult.isException) return validationResult // pass forward exception

	// saving the data when validation has passed
	const id = 1 // await savePostToDatabase(post)

	return success(id)
}

// --------------------------------------------------------------------------------------------------------------------

export const run = async () => {
	const savePostResult = await savePost({
		author: 'John Doe',
		title: 'Error handling should be easier',
		content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet, qui.',
	})

	if (savePostResult.isException) throw new Error(savePostResult())

	console.info(`new post saved: ${savePostResult()}`)
}

run()
