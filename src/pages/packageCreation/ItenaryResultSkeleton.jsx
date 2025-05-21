import React from 'react'
import { Skeleton } from 'antd';


const ItenaryResultSkeleton = () => {
    return (
        <div>
            <div className="container-fluid m-4">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="dayWiseItenaryMainBox mb-3" >

                            <div className="dayWiseItenaryInnerBox">
                                <div className="dayWiseItenaryContent">
                                    <div className='paragraph-Itenary'>
                                        <p className="paragraphinsideItenary">
                                            <p><Skeleton.Input active={true} style={{ width: "305px", height: 25 }} /></p>

                                        </p>
                                    </div>
                                </div>



                                <div className="addActvityRoomItenary mt-4 d-flex justify-content-end">
                                    <span><Skeleton.Button active={true} style={{ width: "250px", height: 37 }} /></span>
                                </div>
                            </div>
                        </div>




                        <div className="dayWiseItenaryMainBox mb-3" >

                            <div className="dayWiseItenaryInnerBox">
                                <div className="headingItenary mb-3">
                                    <p><Skeleton.Input active={true} style={{ width: "200px", height: 25 }} /></p>
                                </div>

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

                                            <p><Skeleton.Button active={true} style={{ width: "40px", height: 30 }} /></p>
                                            <p><Skeleton.Button active={true} style={{ width: "40px", height: 30 }} /></p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* day wise details */}
                        {[1, 2, 3].map((item, index) => {
                            return (
                                <div className="dayWiseItenaryMainBox mb-3" key={index}>
                                    <div className="headingItenary mb-3">
                                        <p><Skeleton.Input active={true} style={{ width: "200px", height: 25 }} /></p>
                                    </div>
                                    <div className="dayWiseItenaryInnerBox">
                                        <div className="dayWiseItenaryContent">
                                            <div className='paragraph-Itenary'>
                                                <p className="paragraphinsideItenary">
                                                    <Skeleton active={true} style={{ height: 10 }} />

                                                </p>
                                            </div>
                                        </div>



                                        <div className="addActvityRoomItenary mt-4 d-flex justify-content-end">
                                            <span><Skeleton.Button active={true} style={{ width: "100px", height: 37 }} /></span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}




                    </div>

                    <div className="col-lg-4">
                        <div className=" mb-3" style={{ height: "400px", background: "white", padding: "10px" }} >

                            <div className="dayWiseItenaryInnerBox">
                                <div className="dayWiseItenaryContent">
                                    <div className='paragraph-Itenary'>
                                        <p className="paragraphinsideItenary">
                                            <p><Skeleton.Input active={true} style={{ width: "100px", height: 15 }} /></p>

                                        </p>
                                    </div>
                                </div>



                                <div className="addActvityRoomItenary mt-4 d-flex justify-content-center">
                                    <p className="hotAddress">
                                        <Skeleton.Input active={true} style={{ width: "250px", height: 10 }} />
                                        <Skeleton.Input active={true} style={{ width: "250px", height: 10 }} />
                                    </p>
                                </div>
                                <div className="addActvityRoomItenary mt-4 d-flex justify-content-center">
                                    <p className="hotAddress">
                                        <Skeleton.Input active={true} style={{ width: "250px", height: 10 }} />
                                        <Skeleton.Input active={true} style={{ width: "250px", height: 10 }} />
                                    </p>
                                </div>
                                <div className="addActvityRoomItenary mt-4 d-flex justify-content-center">
                                    <p className="hotAddress">
                                        <Skeleton.Input active={true} style={{ width: "250px", height: 10 }} />
                                        <Skeleton.Input active={true} style={{ width: "250px", height: 10 }} />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default ItenaryResultSkeleton
