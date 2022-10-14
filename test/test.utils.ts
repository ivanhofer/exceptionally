const dataToTest: (unknown | [unknown, string])[] = [
	undefined,
	null,

	true,
	false,

	0,
	1,
	84.9963,
	4_871_552,
	-56,

	'',
	'value',
	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa porro nemo repellat possimus totam fugiat iusto, ducimus cupiditate exercitationem. Consequatur ipsam numquam accusamus iste reprehenderit. Mollitia repellat molestiae eius architecto eaque dolore eos illo sunt quod hic non, iure, odit nesciunt, quaerat ratione explicabo? Error velit soluta labore amet eius aspernatur expedita dolorem libero dicta illo? Libero eum quae maxime delectus? Porro dicta accusantium earum iste alias ducimus perspiciatis illo vel deleniti fuga quis illum, expedita, ut magnam odit labore repellat debitis error laudantium quae! Laudantium soluta optio laboriosam? Iste ipsa voluptates ab fugiat quos voluptas tempore voluptatum officia quae?',

	[new Date(), 'Date'],

	[Symbol('something'), 'Symbol'],

	[{}, 'empty object'],
	[{ a: 'value', another: 'thing' }, 'object'],
]

export const testDataMatrix = (fn: (data: unknown, name?: string) => void) =>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	dataToTest.forEach(d => fn(...(Array.isArray(d) ? d : [d])))
