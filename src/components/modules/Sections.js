import React, { useEffect, useContext } from 'react'

import { ContentPanel } from './Modules'
import { AuthContext } from '../App'

export default (props) => {
  const { token } = useContext(AuthContext)

  useEffect(() => {
    //axios.get(`https://d1tapi.dabulgaria.bg/sections?town=68134`, {
    //    headers: { 'Authorization': `Bearer ${token}` }
    //}).then(res => {
    //    console.log(res.data);
    //setData(res.data);
    //});
  }, [])

  return (
    <ContentPanel>
      <h1>Секции</h1>
      <hr />
    </ContentPanel>
  )
}
