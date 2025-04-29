import React from 'react'
import { Skeleton } from 'antd';


const HoliResFilterBig = () => {
    return (
        <div className="flightFilterBox">

            <div className="innerFilter">

                <div>
                    <label className="sidebar-label-container ps-0">

                        <p><Skeleton.Input style={{ width: 50, height: 15 }} /></p>
                    </label>

                </div>


                <div>
                    <h2 className="sidebar-title"><Skeleton.Button style={{ width: 60, height: 15 }} /></h2>
                    <div className="position-relative">

                        <Skeleton.Input style={{ width: "100px", height: 10 }} />
                        <Skeleton.Input style={{ width: "100px", height: 10 }} />
                    </div>
                </div>

                <div>
                    <h2 className="sidebar-title"><Skeleton.Button style={{ width: 60, height: 15 }} /></h2>
                    <div>

                        <label className="sidebar-label-container exceptionalFlex" >

                            <Skeleton.Button style={{ width: 120, height: 15 }} />

                        </label>

                    </div>
                </div>


                <div>
                    <h2 className="sidebar-title"><Skeleton.Button style={{ width: 60, height: 15 }} /></h2>
                    <label className="sidebar-label-container exceptionalFlex" >
                        <Skeleton.Avatar shape="circle" />
                        <Skeleton.Button style={{ width: 120, height: 15 }} />
                    </label>
                    <label className="sidebar-label-container exceptionalFlex" >
                        <Skeleton.Avatar shape="circle" />
                        <Skeleton.Button style={{ width: 120, height: 15 }} />
                    </label>
                    <label className="sidebar-label-container exceptionalFlex" >
                        <Skeleton.Avatar shape="circle" />
                        <Skeleton.Button style={{ width: 120, height: 15 }} />
                    </label>
                </div>
                <div>
                    <h2 className="sidebar-title"><Skeleton.Button style={{ width: 60, height: 15 }} /></h2>
                    <label className="sidebar-label-container exceptionalFlex" >
                        <Skeleton.Avatar shape="circle" />
                        <Skeleton.Button style={{ width: 120, height: 15 }} />
                    </label>
                    <label className="sidebar-label-container exceptionalFlex" >
                        <Skeleton.Avatar shape="circle" />
                        <Skeleton.Button style={{ width: 120, height: 15 }} />
                    </label>
                    <label className="sidebar-label-container exceptionalFlex" >
                        <Skeleton.Avatar shape="circle" />
                        <Skeleton.Button style={{ width: 120, height: 15 }} />
                    </label>
                </div>
            </div>
        </div>
    )
}

export default HoliResFilterBig
