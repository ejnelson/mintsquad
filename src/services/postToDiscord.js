import axios from 'axios'

export const postToDiscord = async (values) => {
    const {
        squadLeader,
        discord,
        twitter,
        mintDate,
        overview,
        name,
        price,
        supply,
        website,
        whiteListForm,
    } = values

    const payload = {
        username: 'MintSquad',
        avatar_url:
            'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/crystal-ball_1f52e.png',
        // content: 'Text message. Up to 2000 characters.',
        embeds: [
            {
                author: {
                    name: `Squad Leader: ${squadLeader || 'anonymous'}`,
                    // url: 'Minne_ape_olis#5330',
                    // icon_url:
                    //     'https://4isvscpdfnv4drliginehkrgo4filrahutre5bubppjxm3c2ixpq.arweave.net/4iVZCeMra8HFaDIaQ6omdwqFxAek4k6GgXvTdmxaRd8/?ext=png',
                },
                title: `${name || 'whoops no project name was given'}`,
                // url: 'https://google.com/',
                // description: 'Mint Date:',
                // timestamp: '2015-12-31T12:00:00.000Z',
                // color: 15258703,
                fields: [
                    {
                        name: 'Supply',
                        value: `${supply || 'TBA'}`,
                        inline: true,
                    },
                    {
                        name: 'Price',
                        value: `${price || 'TBA'}`,
                        inline: true,
                    },
                    {
                        name: 'Mint Date',
                        value: `${mintDate || 'TBA'}`,
                        inline: true,
                    },
                    {
                        name: 'Links',
                        value: `${
                            twitter &&
                            '[Twitter](https://twitter.com/' + twitter + ') |'
                        } ${discord && '| [discord](' + discord + ')'} ${
                            whiteListForm &&
                            '| [White List Form](' + whiteListForm + ')'
                        } ${website && '| [Website](' + website + ')'}`,
                    },
                    {
                        name: 'Overview',
                        value: `${overview || 'DYOR'}`,
                    },
                ],
                // thumbnail: {
                //     url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/4-Nature-Wallpapers-2014-1_ukaavUI.jpg',
                // },
                // image: {
                //     url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/A_picture_from_China_every_day_108.jpg',
                // },
                // footer: {
                //     text: 'Check this project out on  [MintSquad.academy](https://mintsquad.academy/)',
                //     icon_url: 'https://i.imgur.com/fKL31aD.jpg',
                // },
            },
        ],
    }

    //test channel
    const res = await axios.post(
        'https://discord.com/api/webhooks/929125496812367872/XXy8QNMlhE5_clKp82OSQaSO0JgqkteadgtVmd0RHS14nZ3cJz4eN9AGC3Xxcq5-rY33',
        payload
    )

    //announcemints
    // const res2 = await axios.post(
    //     'https://discord.com/api/webhooks/929125864526975096/xAbX1-z4_K73NEg-mx_W7xEzx3sGP918bYMNpFlDWXGZc3YjutsA7_jFby7nnu9eYO_A',
    //     payload
    // )
    return res
}
