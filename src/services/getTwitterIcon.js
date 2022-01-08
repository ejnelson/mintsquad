import axios from 'axios'

const herokuProxy = 'https://enigmatic-headland-40206.herokuapp.com/'
const twitterApi = 'https://api.twitter.com/2/users/by/username/'

export const getTwitterIcon = async (twitter) => {
    const {
        data: { access_token },
    } = await axios.post(
        herokuProxy +
            'https://api.twitter.com/oauth2/token?grant_type=client_credentials',
        {},
        {
            auth: {
                username: process.env.REACT_APP_TWITTER_API_KEY,
                password: process.env.REACT_APP_TWITTER_API_KEY_SECRET,
            },
        }
    )
    const {
        data: { data },
    } = await axios.get(herokuProxy + twitterApi + twitter, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        params: {
            'user.fields': 'profile_image_url',
        },
    })
    return data.profile_image_url
}
