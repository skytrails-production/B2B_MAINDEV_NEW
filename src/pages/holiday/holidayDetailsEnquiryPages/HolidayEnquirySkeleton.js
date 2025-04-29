
import React from 'react'
import "./holidayenquiryskeleton.scss"

const HolidayEnquirySkeleton = () => {

    const skItemLeft = () => {
        return (
            <div className="skeletonItemEnquiry">
                <div className="posterBlock skeleton"></div>
                {/* <div className="textBlock">
                    <div className="title skeleton"></div>
                    <div className="date skeleton"></div>
                </div> */}
            </div>
        );
    };
    const skItemRight = () => {
        return (
            <div className="skeletonItemEnquiry">
                {/* <div className="posterBlock skeleton"></div> */}
                <div className="textBlock">
                    <div className="title skeleton mt-3"></div>
                    <div className="title skeleton"></div>
                    <div className="title skeleton"></div>
                    <div className="title skeleton"></div>
                    <div className="title skeleton"></div>
                    <div className="date skeleton"></div>
                </div>
            </div>
        );
    };
    const skItemLeftBottom = () => {
        return (
            <div className="skeletonItemEnquiryBottomOne">
                {/* <div className="posterBlock skeleton"></div> */}
                <div className="textBlock">
                    <div className="bottomHeading skeleton mb-2"></div>
                    <div className="title skeleton"></div>
                    <div className="title skeleton"></div>
                    <div className="title skeleton"></div>
                    <div className="title skeleton"></div>
                </div>
            </div>
        );
    };

    return (
        <div className='pt-4 enquiryMainBox' style={{ background: "white", overflow: "hidden" }} >
            <div className="container">
                <div className="carouselEnquiry">


                    <div className="loadingSkeletonEnquiry">
                        {skItemLeft()}
                        {skItemRight()}

                    </div>


                </div>
                <div className="carouselEnquiryBottomOne">


                    <div className="loadingSkeletonEnquiryBottomOne">

                        {skItemLeftBottom()}
                        {skItemLeftBottom()}
                        {skItemLeftBottom()}

                    </div>


                </div>
            </div>

        </div>
    )
}

export default HolidayEnquirySkeleton

