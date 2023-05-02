import NextAuth, { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
	providers: [
		{
			id: 'yahoo',
			name: 'Yahoo!',
			type: 'oauth',
			version: '2',
			clientId: process.env.YAHOO_CLIENT_ID,
			clientSecret: process.env.YAHOO_CLIENT_SECRET,
			authorization: {
				url: 'https://api.login.yahoo.com/oauth2/request_auth',
				params: {
					client_id: process.env.YAHOO_CLIENT_ID,
					redirect_uri: process.env.REDIRECT_URI,
					response_type: 'code',
				},
			},
			profile(profile) {
				return {
					name: profile.name,
				}
			},
		},
	],
	callbacks: {
		async redirect({ url, baseUrl }: any) {
			console.log(url)
			console.log(baseUrl)
		},
		async session({ session, user, token }: any) {
			console.log(session)
			console.log(user)
			console.log(token)
		}
	},
}

export default NextAuth(authOptions)
