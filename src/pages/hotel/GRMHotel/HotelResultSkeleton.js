import React from 'react'


// import "./holidayresultskeleton.scss"



const HotelResultSkeleton = () => {
    // con



    const skItemLeft = () => {
        return (
            <div className="skeletonItemResultCard">
                <div className="posterBlock skeleton"></div>
                {/* <div className="textBlock">
                    <div className="title skeleton"></div>
                    <div className="date skeleton"></div>
                </div> */}
            </div>
        );
    };

    const skItemLeftFilterBig = () => {
        return (
            <div className="skeletonItemResultFilter">
                <div className="posterBlock skeleton"></div>
                {/* <div className="textBlock">
                    <div className="title skeleton"></div>
                    <div className="date skeleton"></div>
                </div> */}
            </div>
        );
    };

    return (
        <div className='' style={{ backgroundColor: "white" }}>

            <div className='container'>
                <div className="row">

                    {[1, 2, 3, 4].map((item) => {
                        return (
                            <div className="col-lg-6">
                                <div className="carouselResultCard">
                                    <div className="loadingSkeletonResultCard">
                                        {skItemLeft()}
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}

export default HotelResultSkeleton
