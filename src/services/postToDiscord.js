import axios from 'axios'
import { parse, format } from 'date-fns'

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
        type: 1,
        channel_id: '909624010487255071',
        username: 'MintSquad',
        // avatar_url:
        // 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/crystal-ball_1f52e.png',
        // content: 'Text message. Up to 2000 characters.',
        embeds: [
            {
                author: {
                    name: `Squad Leader: ${squadLeader || 'anonymous'}`,
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
                        value: `${
                            mintDate
                                ? format(
                                      parse(
                                          mintDate,
                                          "yyyy-MM-dd'T'HH:mm:ss'Z'",
                                          new Date()
                                      ),
                                      "MMM dd HH:mm a 'UTC'"
                                  )
                                : 'TBA'
                        }`,
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
                    {
                        name: 'Link to Mintsquad.academy',
                        value: `[Mintsquad.academy](https://mintsquad.academy)`,
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
    // const res = await axios.post(
    //     'https://discord.com/api/webhooks/932709353570578532/g8QyvJBeY98mxeTjtkudq3svpb4x0n5iYhnAUzCr16bUlyXZY_89WN6y5KppLRkwzIlT',

    //     payload
    // )

    // announcemints
    const res = await axios.post(
        'https://discord.com/api/webhooks/933070460667699260/Y5uzNlA3cjqbrwQm85xl-al9Zqz_uX9_OG20rDDzNVVRYNlXWc2EkP1wuT8k5SivFYx5',
        payload
    )
    return res
}
