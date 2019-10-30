module.exports = {
    dependencies: [
        {
            name: '@areslabs/stringutil-rn',
            wxName: '@areslabs/stringutil-wx',
            wxVersion: '1.0.0'
        },

        {
            name: '@areslabs/hi-rn',
            wxName: '@areslabs/hi-wx',
            compLists: [
                {
                    name: 'Hi',
                    path: '/hi',
                    base: true
                }
            ]
        },

        {
            name: '@areslabs/hello-rn',
            wxName: '@areslabs/hello-wx',
            compLists: [
                {
                    name: 'Hello',
                    path: '/src/index'
                },
                {
                    name: 'HelloRN',
                    path: '/src/HelloRN'
                },
                {
                    name: 'HelloWX',
                    path: '/src/HelloWX'
                }
            ]
        }
    ],
}