import React from "react";
import Divider from "@mui/material/Divider";
import { Skeleton } from 'antd';


const SkeletonHotelResultFilter = () => {
    return (
        <div className="flightFilterBox">
            <div className="filterTitle">
                <p><Skeleton.Input active={true} style={{ width: 60, height: 25 }} /></p>
            </div>

            <div className="innerFilter">

                <div>
                    <label className="sidebar-label-container ps-0">

                        <p><Skeleton.Input active={true} style={{ width: 50, height: 15 }} /></p>
                    </label>

                </div>


                <div className="busDepartureMain">
                    <h2 className="sidebar-title"><Skeleton.Input active={true} style={{ width: 40, height: 20 }} /></h2>

                    <div>

                        <label className="sidebar-label-container ps-0">
                            <div className="svgBOx">
                                <div>
                                    <Skeleton.Button active={true} style={{ width: 30, height: 30 }} />
                                </div>
                            </div>
                        </label>
                        <label className="sidebar-label-container ps-0">
                            <div className="svgBOx">
                                <div>
                                    <Skeleton.Button active={true} style={{ width: 30, height: 30 }} />
                                </div>
                            </div>
                        </label>

                    </div>
                </div>

                <div>
                    <h2 className="sidebar-title"><Skeleton.Button active={true} style={{ width: 60, height: 15 }} /></h2>
                    <div className="position-relative">

                        <Skeleton.Input active={true} style={{ width: "100px", height: 10 }} />
                        <Skeleton.Input active={true} style={{ width: "100px", height: 10 }} />
                    </div>
                    <Divider sx={{ marginBottom: "15px", backgroundColor: "gray" }} />
                </div>

                <div>
                    <h2 className="sidebar-title"><Skeleton.Button active={true} style={{ width: 60, height: 15 }} /></h2>
                    <div>

                        <label className="sidebar-label-container exceptionalFlex" >

                            <Skeleton.Avatar active={true} shape="circle" />
                            <Skeleton.Button active={true} style={{ width: 120, height: 15 }} />

                        </label>

                    </div>
                    <Divider sx={{ marginBottom: "15px", backgroundColor: "gray" }} />
                </div>


                <div>
                    <h2 className="sidebar-title"><Skeleton.Button active={true} style={{ width: 60, height: 15 }} /></h2>
                    <label className="sidebar-label-container exceptionalFlex" >
                        <Skeleton.Avatar active={true} shape="circle" />
                        <Skeleton.Button active={true} style={{ width: 120, height: 15 }} />
                    </label>
                    <label className="sidebar-label-container exceptionalFlex" >
                        <Skeleton.Avatar active={true} shape="circle" />
                        <Skeleton.Button active={true} style={{ width: 120, height: 15 }} />
                    </label>
                    <label className="sidebar-label-container exceptionalFlex" >
                        <Skeleton.Avatar active={true} shape="circle" />
                        <Skeleton.Button active={true} style={{ width: 120, height: 15 }} />
                    </label>
                </div>
            </div>
        </div>
    )
}

export default SkeletonHotelResultFilter
