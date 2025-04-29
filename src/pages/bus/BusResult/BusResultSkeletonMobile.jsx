import React from 'react'
import { Divider, Form, Radio, Skeleton, Space, Switch } from 'antd';


const BusResultSkeletonMobile = () => {



    return (
        <div className="d-flex flex-row justify-content-between align-items-center mb-3 mt-3">
            <Space>
                <Skeleton.Button active={false} size={'small'} shape={'round'} />
                <Skeleton.Button active={false} size={'small'} shape={'round'} />
                <Skeleton.Button active={false} size={'small'} shape={'round'} />
                <Skeleton.Button active={false} size={'small'} shape={'round'} />
                <Skeleton.Button active={false} size={'small'} shape={'round'} />
            </Space>
        </div>
    )
}

export default BusResultSkeletonMobile
