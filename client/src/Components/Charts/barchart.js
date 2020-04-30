import React from 'react'; 
import { Chart } from 'react-charts'
import API from "../../Configs/api.json"
import TextUtilities from "../../utilities/text";

export default class BarChar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cases: localStorage.getItem(props.data) || "",
      data : [[".", 0]],
      update: ""
    }
  }
  componentDidMount(){
    const events = new EventSource(API.baseURL + API.updates); 
      events.addEventListener(this.props.data, (e) => {
        const cases = TextUtilities.processUpdate(e.data,this.state.cases);
              this.processCases(cases)
      });
      this.processCases();
  }
  processCases(cases){
    const exclude = ["today", "__v","_id"]
    if (!cases){
        cases = localStorage.getItem(this.props.data)
    }    
    const p = JSON.parse(cases)
    if(p && p.length){
      localStorage.setItem(this.props.data, cases)
      const raw_data = p[0]
      const data = Object.keys(raw_data).filter(k => !exclude.includes(k)).map(p => [p, Number.parseInt(raw_data[p])]).filter(a => a[1])
      const update = TextUtilities.getLocalCaption("_data_actual_as_of_today") + ": " + raw_data["today"];
      this.setState({cases, data, update});
    }  
  }
  render(){
    const series = {
      type: 'bar'
    }
    const data = [{
      data: this.state.data
    }];
    const axes = [{ primary: true, type: 'ordinal', position: 'bottom', rotation: 45 },
        { position: 'left', type: 'linear', stacked: true }
      ] 

    return (
      this.state.cases && <div className="my-5 py-4">
        <h5>
          {this.props.caption}
        </h5>
        <div className="col-12 mt-3" style={{ height: '300px' }}>
          <Chart data={data} series={series} axes={axes} tooltip />
          <div className="my-3">
            <em>{this.state.update}</em>
          </div>
        </div>
     </div>
    )
  }
}