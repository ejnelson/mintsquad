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
        images,
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
                            '[Twitter](https://twitter.com/' + twitter + ')'
                        } ${discord && '| [Discord](' + discord + ')'} ${
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
            // ...images.map((image) => ({
            //     image: {
            //         url: image,
            //     },
            // })),
            // {
            //     image: {
            //         url: images[0] || '',
            //     },
            // },
            // {
            //     image: {
            //         url: images[1] || '',
            //     },
            // },
            // {
            //     image: {
            //         url: images[2] || '',
            //     },
            // },
            // {
            //     image: {
            //         url: images[3] || '',
            //     },
            // },
            // {
            //     image: {
            //         url: images[4] || '',
            //     },
            // },
            // {
            //     image: {
            //         url: images[5] || '',
            //     },
            // },
            // {
            //     image: {
            //         url: images[6] || '',
            //     },
            // },
            // {
            //     image: {
            //         url: images[7] || '',
            //     },
            // },
            // {
            //     image: {
            //         url: images[8] || '',
            //     },
            // },
        ],
    }
    // const payload = {
    //     username: 'Webhook',
    //     avatar_url: 'https://i.imgur.com/4M34hi2.png',
    //     content: 'Text message. Up to 2000 characters.',
    //     embeds: [
    //         {
    //             author: {
    //                 name: 'Birdie♫',
    //                 url: 'https://www.reddit.com/r/cats/',
    //                 icon_url: 'https://i.imgur.com/R66g1Pe.jpg',
    //             },
    //             title: 'Title',
    //             url: 'https://google.com/',
    //             description:
    //                 'Text message. You can use Markdown here. *Italic* **bold** __underline__ ~~strikeout~~ [hyperlink](https://google.com) `code`',
    //             color: 15258703,
    //             fields: [
    //                 {
    //                     name: 'Text',
    //                     value: 'More text',
    //                     inline: true,
    //                 },
    //                 {
    //                     name: 'Even more text',
    //                     value: 'Yup',
    //                     inline: true,
    //                 },
    //                 {
    //                     name: 'Use `"inline": true` parameter, if you want to display fields in the same line.',
    //                     value: 'okay...',
    //                 },
    //                 {
    //                     name: 'Thanks!',
    //                     value: "You're welcome :wink:",
    //                 },
    //             ],
    //             thumbnail: {
    //                 url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/4-Nature-Wallpapers-2014-1_ukaavUI.jpg',
    //             },
    //             image: {
    //                 url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/A_picture_from_China_every_day_108.jpg',
    //             },
    //             footer: {
    //                 text: 'Woah! So cool! :smirk:',
    //                 icon_url: 'https://i.imgur.com/fKL31aD.jpg',
    //             },
    //         },
    //     ],
    // }
    //test channel
    const res = await axios.post(
        'https://discord.com/api/webhooks/929534918164348948/rAGUeFWeuSrfGkmn26RoUBMH4ycIn5CjngisNGcb5rxgQ4dTJ-SCLJlzH7-5lXRzD0kX',

        payload
    )
    // console.log('res', res)
    // announcemints
    // const res2 = await axios.post(
    //     'https://discord.com/api/webhooks/929125864526975096/xAbX1-z4_K73NEg-mx_W7xEzx3sGP918bYMNpFlDWXGZc3YjutsA7_jFby7nnu9eYO_A',
    //     payload
    // )
    return res
}
