const faker = require('faker');
const uuid = require('node-uuid');

function makeWorkItem () {
	const priority = Math.floor(Math.random() * 10);
	return {
		priority,
		guid: uuid.v4(),
		filename: faker.system.commonFileName()
	};
}

function workItems(length) {
	return Array.from({ length }, makeWorkItem);
}

module.exports = workItems;