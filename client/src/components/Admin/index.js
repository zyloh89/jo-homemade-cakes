import React, { Component } from 'react'
import style from './style.module.css'
import _ from 'lodash';
import QuoteData from './quoteData/quoteData';
const axios = require('axios')

class Admin extends Component {
  state = {
    allQuotes: [],
    orderBy: "",
    order: "",  // "ascending" or "descending",
  }
  
  componentDidMount = () =>{
    this.getAllQuotes()
  }

  getAllQuotes = async () => {
    const token = localStorage.getItem('token')
    const url = `${process.env.REACT_APP_API_URL}/quote/getAllQuotes`
    const response = await axios.get(url, {headers: { token } });
    const data = await response.data;
    this.setState({ allQuotes: data });
  };

  doOrderBy = e => {
    e.preventDefault();
    this.setState({ orderBy : e.target.value });
  }
  doOrder = e => {
    e.preventDefault();
    this.setState({ order : e.target.value });
  }
  render() {

    let { orderBy, order, allQuotes }  = this.state
    allQuotes  = _.orderBy(allQuotes, orderBy, order)

    const items = allQuotes.map((item, index) =>{
      return (
        
      <QuoteData 
        data={ item }
        key={ item._id }
        orderBy={ this.state.orderBy }
        id={index}
      />
      )
    }); 

    if(!allQuotes) {
      return ( 
        <div className={style.quotedetailouterloading}>
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      )
    } else {
      return (
        <>
        <div className="container">
        <div className={style.dashcont}>
          <h1 className={style.dashtitle}>All Quotes</h1>
          <div className={style.sortbutton}>
            <select value={this.state.value} onChange={this.doOrderBy}>
              <option value="" selected disable hidden>Sort By Category</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="phoneNumber">Phone Number</option>
              <option value="pickUpDateAndTime">Estimated Pick Up</option>
              <option value="createdAt">Created At</option>
            </select>
            <select value={this.state.value} onChange={this.doOrder}>
              <option value="" selected disable hidden>Sort Order</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div className={style.dashboardcontainer}>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col" >Number</th>
                  <th scope="col" >First Name</th>
                  <th scope="col" >Last Name</th>
                  <th scope="col" >Phone Number</th>
                  <th scope="col" >Estimated Pick Up</th>
                  <th scope="col" >Created At</th>
                </tr>
              </thead>
              <tbody>
                { items }
              </tbody>
            </table>
          </div>
        </div>
        </div>
        </>
      )

    }
  }
}

export default Admin;


