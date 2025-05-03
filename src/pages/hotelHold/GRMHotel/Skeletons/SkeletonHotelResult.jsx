import React from "react";
// import Divider from "@mui/material/Divider";
import { Skeleton } from 'antd';





const SkeletonHotelResult = () => {
    return (
        <>

            {[1, 2, 3].map((item) => (
                <div className="hotelResultBoxSearch" >
                    <div>
                        <div className="hotelImage">
                            <Skeleton.Image active={true} style={{ width: 250, height: 180 }} />
                        </div>
                        <div className="hotelResultDetails">
                            <div className="hotleTitle">
                                <p><Skeleton.Input active={true} style={{ width: "200px", height: 25 }} /></p>
                            </div>


                            <div className="hotelRating">
                                <div>
                                    {[1, 2, 3].map((item) => (
                                        <Skeleton.Avatar className="ms-1" active={true} shape="circle" />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="hotAddress">
                                    <Skeleton.Input active={true} style={{ width: "250px", height: 10 }} />
                                    <Skeleton.Input active={true} style={{ width: "250px", height: 10 }} />
                                </p>
                            </div>
                            <div className="breakCancel">

                                <span className="brcl1">
                                    <Skeleton.Input active={true} style={{ width: "150px", height: 10 }} />
                                </span>
                            </div>

                        </div>
                    </div>

                    <div className="priceBookHotel">
                        <div className="priceBookHotelOne ">
                            <span><Skeleton.Button active={true} style={{ width: "20px", height: 10 }} /></span>
                            <span><Skeleton.Button active={true} style={{ width: "30px", height: 10 }} /></span>
                            <p><Skeleton.Button active={true} style={{ width: "40px", height: 30 }} /></p>
                            <p><Skeleton.Button active={true} style={{ width: "40px", height: 30 }} /></p>
                        </div>
                    </div>
                </div>
            ))}

        </>
    )
}

export default SkeletonHotelResult
