import * as React from "react";
import { Box } from "@mui/material";
import { Skeleton, Space } from 'antd';

const SkeletonBookRoom = () => {
    return (
        <div className="my-4 ">
            <div className="container">
                <div className="row">

                    <div className="col-lg-12 mb-4">
                        <div className="bookRoomHotDetails">
                            <div>
                                <div>
                                    <p className="hotelName">
                                        <Skeleton.Input active={true} style={{ width: "350px", height: 20, marginBottom: "5px" }} />
                                    </p>
                                </div>

                                <div>
                                    <p className="text-start">
                                        <Skeleton.Input active={true} style={{ width: "350px", height: 10 }} />
                                    </p>
                                </div>
                            </div>

                            <div className="hotelBookDesignFirst">
                                <div>
                                    <Box>

                                        <Space>
                                            <Skeleton.Avatar active={true} shape="circle" />
                                            <Skeleton.Avatar active={true} shape="circle" />
                                            <Skeleton.Avatar active={true} shape="circle" />
                                        </Space>
                                    </Box>
                                </div>
                                <div className="mapp">
                                    <Space>

                                        <Skeleton.Input active={true} style={{ width: "50px", height: 15 }} />

                                    </Space>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* gallery  */}
                    <div className="col-lg-12 mb-4">
                        <div className="row g-3">
                            <div className="col-lg-6">
                                <div className="antImgGall" style={{ position: 'relative' }}>
                                    {/* <Image width={'100%'} src={hotelGallery?.[0]?.url} /> */}
                                    <Skeleton.Image className="skeWidth" active={true} style={{ height: 330 }} />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="row g-3">
                                    {[1, 2, 3, 4].map((item, index) => (
                                        <div className="col-lg-6">
                                            <div className=" antImgGallSmall" >
                                                <Skeleton.Image className="skeWidth" style={{ height: 157 }} active={true} />

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="row gy-4">
                    <div className="col-lg-8 ">
                        <div className="container">
                            <div className="row">



                                {/* check in check out  */}
                                <div className="col-lg-12 p-0">
                                    <div className="roomDetailsReviewDesc">
                                        <div className="row">
                                            <div className="col-lg-4 col-4">
                                                <div className="checkInReview">
                                                    <Skeleton.Button active={true} style={{ height: 10 }} />
                                                    <Skeleton.Button active={true} style={{ height: 10 }} />
                                                    <Skeleton.Button active={true} style={{ height: 10 }} />

                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-4">
                                                <div className="checkInReview">
                                                    <Skeleton.Button active={true} style={{ height: 10 }} />
                                                    <Skeleton.Button active={true} style={{ height: 10 }} />
                                                    <Skeleton.Button active={true} style={{ height: 10 }} />
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-4">
                                                <div className="checkInReview">
                                                    <Skeleton.Button active={true} style={{ height: 10 }} />
                                                    <Skeleton.Button active={true} style={{ height: 10 }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* room select details sectin  */}

                            <div className="row">
                                <div className="mt-3 p-0">

                                    <div className="roomCompo">
                                        <div className="offer_area">
                                            <div>
                                                <div className="insideOffer">
                                                    <Skeleton.Avatar active={true} shape="circle" />

                                                    <div className="inneraccorHotel">

                                                        <div className="ratePlan" >
                                                            <Skeleton.Button active={true} style={{ height: 20 }} />
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="insideOffer">

                                                    <div className="inneraccorHotel">

                                                        <div className="ratePlan" >
                                                            <Skeleton.Button active={true} style={{ height: 10 }} />
                                                        </div>

                                                    </div>

                                                    <div className="inneraccorHotel">

                                                        <div className="ratePlan" >
                                                            <Skeleton.Button active={true} style={{ height: 10 }} />
                                                        </div>

                                                    </div>



                                                </div>


                                            </div>
                                            <div className="priceCheck">
                                                <Skeleton.Button active={true} style={{ height: 20 }} />
                                                <div>
                                                    <Skeleton.Button active={true} style={{ height: 20 }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>


                            </div>
                            <div
                                className="row"
                            >
                                <div className="mt-3 p-0">

                                    <div className="roomCompo">
                                        <div className="offer_area">
                                            <div>
                                                <div className="insideOffer">
                                                    <Skeleton.Avatar active={true} shape="circle" />

                                                    <div className="inneraccorHotel">

                                                        <div className="ratePlan" >
                                                            <Skeleton.Button active={true} style={{ height: 20 }} />
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="insideOffer">

                                                    <div className="inneraccorHotel">

                                                        <div className="ratePlan" >
                                                            <Skeleton.Button active={true} style={{ height: 10 }} />
                                                        </div>

                                                    </div>

                                                    <div className="inneraccorHotel">

                                                        <div className="ratePlan" >
                                                            <Skeleton.Button active={true} style={{ height: 10 }} />
                                                        </div>

                                                    </div>



                                                </div>


                                            </div>
                                            <div className="priceCheck">
                                                <Skeleton.Button active={true} style={{ height: 20 }} />
                                                <div>
                                                    <Skeleton.Button active={true} style={{ height: 20 }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>




                                <div className="col-lg-12">
                                    <div className="reviewDescriptionButton">

                                        <Skeleton.Button active={true} style={{ height: 30, width: 120 }} />

                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>

                    {/* Amenities  */}

                    <div className="col-lg-4 ">
                        <div className="col-lg-12 p-0 ">
                            <div className="bookflightPassenger">
                                <form>
                                    <div className="bookFlightPassInner">
                                        <div className="bookAdultIndex">
                                            <Skeleton.Button active={true} style={{ height: 15 }} />
                                        </div>
                                        <div className="row g-3 ">
                                            <div className="col-lg-12 my-4">
                                                <div className="hotelReviewAmetnities2">
                                                    <div>
                                                        <Skeleton.Button active={true} style={{ height: 10 }} />
                                                        <Skeleton.Button active={true} style={{ height: 10 }} />
                                                        <Skeleton.Button active={true} style={{ height: 10 }} />
                                                        <Skeleton.Button active={true} style={{ height: 10 }} />
                                                        <Skeleton.Button active={true} style={{ height: 10 }} />
                                                        <Skeleton.Button active={true} style={{ height: 10 }} />
                                                        <Skeleton.Button active={true} style={{ height: 10 }} />
                                                        <Skeleton.Button active={true} style={{ height: 10 }} />
                                                        <Skeleton.Button active={true} style={{ height: 10 }} />
                                                        <Skeleton.Button active={true} style={{ height: 10 }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default SkeletonBookRoom
