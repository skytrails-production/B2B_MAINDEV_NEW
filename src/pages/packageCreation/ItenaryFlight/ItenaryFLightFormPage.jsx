import React, { useEffect } from 'react'
import { Tabs } from "antd";

import ItenaryRoundFlightForm from './ItenaryRoundFlightForm';
import { useDispatch } from 'react-redux';
import ItenaryOnewayForm from './ItenaryOnewayForm';
const { TabPane } = Tabs;
const ItenaryFLightFormPage = ({ closeModal, selectedIndex, onFlightSelect }) => {


    return (
        <div>
            <div

                className="container"
            >

                <div className="row">
                    <div className="mt-3">
                        <Tabs defaultActiveKey="2">
                            <TabPane tab="Oneway" key="1">
                                <ItenaryOnewayForm selectedIndex={selectedIndex} closeModal={closeModal} onFlightSelect={onFlightSelect} />
                            </TabPane>
                            <TabPane tab="Round Trip" key="2">
                                <ItenaryRoundFlightForm selectedIndex={selectedIndex} closeModal={closeModal} onFlightSelect={onFlightSelect} />
                            </TabPane>

                        </Tabs>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ItenaryFLightFormPage
