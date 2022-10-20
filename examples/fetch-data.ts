/* eslint-disable no-console */

import { assertSuccess, exception, Exceptionally, success } from 'exceptionally'
import { fetch } from 'undici'

// --------------------------------------------------------------------------------------------------------------------

// define different Exception classes for all kind of exceptions
class NetworkException extends Error {
	readonly #id = Symbol.for('NetworkException')
}
class DecodeJsonException extends Error {
	readonly #id = Symbol.for('DecodeJsonException')
}
class HttpException extends Error {
	readonly #id = Symbol.for('HttpException')
}
class EmptyDatasetException extends Error {
	readonly #id = Symbol.for('EmptyDatasetException')
}

// when fetching data, a few things can happen.. when something fails, it is good to know what has triggered the issue
const fetchData = async <ReturnType>(endpoint: string) => {
	const fetchResult = await fetch(endpoint)
		.catch(e => exception(new NetworkException(e))) // the server could be unavailable ...
	if (fetchResult instanceof Exceptionally) return fetchResult // pass forward exception

	// ... the request could fail with a statuscode 4xx or 5xx ...
	if (!fetchResult.ok) return exception(new HttpException(`${fetchResult.status}: ${fetchResult.statusText}`))

	const dataResult = await fetchResult.json()
		.then(data => data as ReturnType)
		.catch(e => exception(new DecodeJsonException(e))) // ... or the payload could consist of invalid JSON ...
	if (dataResult instanceof Exceptionally) return dataResult // pass forward exception

	if (Array.isArray(dataResult) && !dataResult.length) {
		return exception(new EmptyDatasetException()) // ... or maybe the validation of the data could fail ..
	}

	return success(dataResult) // ... and finally fetching data could also be successful
}

// --------------------------------------------------------------------------------------------------------------------

type User = {
	id: string
	name: string
}

const getUsers = async () => {
	const fetchUsersResult = await fetchData<User[]>('https://some-api.com/users')

	// whenever we get back a result, we should check for exceptions first
	if (fetchUsersResult.isException) {
		const exc = fetchUsersResult()
		// handle a certain type of exception individually
		if (exc instanceof NetworkException) {
			return exception('Could not fetch users. Please try again later.')
		}

		// we don't really care about the `EmptyDatasetException` here
		if (!(exc instanceof EmptyDatasetException)) {
			return exception('Unexpected error. Please contact the support-team.')
		}
	}

	// the result can either be successful and contain our users or be of type `EmptyDatasetException`
	const users = fetchUsersResult.isSuccess ? fetchUsersResult() : []

	// do something with the data
	console.info(`successfully fetched ${users.length} users`)

	return success(users) // pass forward data
}

// --------------------------------------------------------------------------------------------------------------------

const getAllUsernames = async () => {
	const usersResult = await getUsers()
	// even after multiple nested function calls we can make sure what all possible outcomes can be
	if (usersResult.isException) {
		// at the end of our program flow we finally throw the error that e.g. get's displayed to the user
		throw new Error(usersResult())
	}

	// we can make sure that we have catch'ed all exceptions
	// TypeScript will let you know if you forget to handle an exception
	// try to remove the line that throws the Error above and you'll see an error here
	assertSuccess(usersResult)

	// at the end we return the data without wrapping it, so it can be consumed in an usual way
	return usersResult().map(({ name }) => name)
}

// --------------------------------------------------------------------------------------------------------------------

const usernames = await getAllUsernames()
console.info(usernames)
