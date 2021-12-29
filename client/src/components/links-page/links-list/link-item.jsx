import React from 'react'
import {Link} from "react-router-dom";

export const LinkItem = ({link, index}) => {
    const {to, title, from, _id, clicks} = link

    return (
      <tr key={_id}>
          <td>{index + 1}</td>
          <td>{title ? title : from}</td>
          <td>{to}</td>
          <td>{clicks}</td>
          <td><Link to={`/details/${_id}`}><i className="material-icons">search</i></Link></td>
      </tr>
  )
}
