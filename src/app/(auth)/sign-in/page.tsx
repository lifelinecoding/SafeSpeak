import React from 'react'

const page = () => {
  return (
    <form method="post" action="/api/auth/callback/credentials">
      <input name="csrfToken" type="hidden" />
      <label>
        Username
        <input name="username" type="text" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button type="submit">Sign in</button>
    </form>
  )
}

export default page