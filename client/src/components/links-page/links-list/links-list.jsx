import React from "react";
import './links-list.css'
import {Link} from "react-router-dom";

export const LinksList = ({links}) => {

    if (links.length === 0) {
        return (
            <div className={'links-list'}>
                <div className="no-links">
                    <p> There is no links yet</p>

                </div>
            </div>
        )

    }


  return (
      <div className={'links-list'}>

          <table>
              <thead>
              <tr>
                  <th>#</th>
                  <th>Destination</th>
                  <th>Short link</th>
                  <th>Clicks</th>
                  <th>Details</th>
              </tr>
              </thead>

              <tbody>

              {links.map((link, index) => {
                  const {to, from, _id, clicks} = link
                  return (
                      <tr key={_id}>
                          <td>{index+1}</td>
                          <td>{from}</td>
                          <td>{to}</td>
                          <td>{clicks}</td>
                          <td><Link to={`/details/${_id}`}><i className="material-icons">search</i></Link></td>
                      </tr>
                  )
              })}

              </tbody>
          </table>
      </div>
  )
}
