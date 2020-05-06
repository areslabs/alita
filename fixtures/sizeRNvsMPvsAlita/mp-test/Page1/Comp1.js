
function randomName() {
	return "ykforerlang".split('').sort(() => {
		return Math.random() > 0.5 ? 1 : -1
	}).join('')
}

Component({
	data: {
		users: [
			{
				name: randomName(),
				age: parseInt(Math.random() * 20),
			},
			{
				name: randomName(),
				age: parseInt(Math.random() * 20),
			},
			{
				name: randomName(),
				age: parseInt(Math.random() * 20),
			},
			{
				name: randomName(),
				age: parseInt(Math.random() * 20),
			}
		]
	},

	methods: {


		addUser() {
			this.setData({
				users: this.data.users.concat([{
					name: randomName(),
					age: parseInt(Math.random() * 20)
				}])
			})
		}
	},
})
