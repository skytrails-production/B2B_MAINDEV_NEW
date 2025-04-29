
import React from 'react'


// import "./holidayresultskeleton.scss"



const BusResultSke = () => {
    // con



    const skItemLeft = () => {
        return (
            <div className="skeletonItemResultCard">
                <div className="posterBlock skeleton"></div>
            </div>
        );
    };


    return (
        <div className='' style={{ backgroundColor: "white" }}>

            <div className='container'>
                <div className="row">

                    {[1, 2, 3, 4, 5, 6, 7].map((item) => {
                        return (
                            <div className="col-lg-12">
                                <div className="carouselResultCardBus">
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

export default BusResultSke
