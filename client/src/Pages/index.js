import React from 'react';
import Utils from "../utilities"
import AnimateLoad from "../HOCS/AnimateLoad"
import BarChart from "../Components/Charts/barchart";
import InfoCard from "../Components/card/info";
import ZimbabweMapCard from "../Components/card/map";
import TextUtilities from "../utilities/text";
import DateUtilities from "../utilities/date"
import API from "../Configs/api.json"

const Home = AnimateLoad(class Home extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                cases: localStorage.getItem("UpdateSummary") ||  "", 
                data: [], 
                update: "",
                text_data: {
                    "TotalTests": 0,
                    "PositiveCases": 0, 
                    "NegativeTests": 0, 
                    "Deaths": 0, 
                    "ICU": 0, 
                },
                online: " offline",
                aggr_data: {
                },
                "apiday"              : [],
                "apicase"             : []
            }
        }
        componentDidMount(){
            const events = new EventSource(API.baseURL + API.updates); 
            events.addEventListener("UpdateSummary" , (e) => {
                const cases = TextUtilities.processUpdate(e.data,this.state.cases);
                this.processCases(cases);
            });
            events.onerror = (e) => {
                console.log("Lost connection to host")
                events.close();
            }
            this.processCases()
        }
        processCases(cases){
            let online = "";
            const last_update = localStorage.getItem("last_update")
            if (last_update){
                online = ": data factual as of "+ last_update;
            }else{
                online = ": last update unknown"
            }
            if (!cases){                
                cases = localStorage.getItem("UpdateSummary")
            }
            
            const p = JSON.parse(cases)
            if(p && p.length){
                
                const data = p[0]
                const text_data = this.state.text_data
                const keys = Object.keys(text_data);
                for(let i = 0; i < keys.length; ++i){
                    text_data[keys[i]] = data[keys[i]] + " " + Utils.TextUtils.getLocalCaption("_" + keys[i]) ;
                }
                const update = TextUtilities.getLocalCaption("_data_actual_as_of_today") + ": " + data["today"];
                localStorage.setItem("UpdateSummary", cases) 
                localStorage.setItem("last_update", Utils.DateUtils.getLocalDate())
                online = ": data factual as of "+ Utils.DateUtils.getLocalDate();
                this.setState({cases, data, update, text_data, online});
            }   
        }
        render () {
            return (
                <div className="">            
                    <div className="container-fluid mt-5">
                        <div className="row">
                            <div className="col-12 h3">
                                {Utils.TextUtils.getLocalCaption("_home_lead")}

                                {this.state.online}
                            </div>
                            <div className="col-12 col-md-6 col-lg-8">
                                <div className="col-12 px-0">
                                    <BarChart data="CasesProvince" caption={TextUtilities.getLocalCaption("_provincial_cases")}/>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <BarChart data="sexUpdate" caption={TextUtilities.getLocalCaption("_gender_cases")} />
                                    </div>
                                    <div className="col-6">
                                        <BarChart data="transmissionUpdate" caption={TextUtilities.getLocalCaption("_transmision_cases")}/>
                                    </div>
                                </div>                                
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <div className="col-12 pt-5">
                                    <ZimbabweMapCard />
                                </div>
                                <InfoCard className="border border-2x border-primary my-3 p-3" title={this.state.text_data["TotalTests"]} >
                                    <div className="text-success"> 
                                        {this.state.text_data["NegativeTests"]}
                                    </div>
                                    <div className="text-danger">
                                        {this.state.text_data["PositiveCases"]}
                                    </div>                                    
                                </InfoCard>
                                <InfoCard className="border border-2x border-primary my-3 p-3" title={this.state.text_data["Deaths"]}>
                                    <div className="text-danger">
                                        {this.state.text_data["PositiveCases"]}
                                    </div>    
                                </InfoCard>
                                <InfoCard className="border border-2x border-primary my-3 p-3" title={this.state.text_data["ICU"]} />
                                <div className="my-3">
                                    <em>{this.state.update}</em>
                                </div>
                            </div>
                            <div className="col-12">
                                {Utils.TextUtils.getLocalCaption("_home_description")}
                            </div>
                        </div>
                    </div>
                </div>      
            ); 
        }
    }
)
  
  export default Home;