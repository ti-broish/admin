import React from 'react';

import styled from 'styled-components';

const SectionInput = styled.div`
    width: 100%;

    span {
        font-size: 12px;
        text-align: center;
        display: inline-block;
        padding: 3px 0;
        border-left: 1px solid #eee;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;
        color: #333;
        //font-weight: bold;

        &.last {
            border-right: 1px solid #eee;
        }
    }

    .box {
        width: 36px;
        height: 44px;
        border: 1px solid #eee;
        display: inline-block;
        box-sizing: border-box;
        vertical-align: top;
        border-right: none;

        &.last {
            border-right: 1px solid #eee;
        }

        &.invalid {
            background-color: #ff8f8f;
        }

        &.changed {
            background-color: #fdfd97;
        }
    }

    input {
        letter-spacing: 14.4px;
        box-sizing: border-box;
        border: none;
        font-size: 36px;
        font-family: 'Courier New', monospace;
        padding: 2px  0 0 6px;
        z-index: 30;
        display: inline-block;
        position: relative;
        background: none;
        color: #333;

        &:focus {
            border: none;
            background: none;
            outline: none;
        }
    }
`;

export default props => {

    const getBoxClass = boxNum => {
        const status = props.fieldStatus[`sectionId${boxNum}`];
        return status.invalid? 'box invalid' : status.changed? 'box changed' : 'box';
    };

    return(
        <>
            <table>
            <tbody>
                <tr>
                    <td>Номер на секция</td>
                    <td style={{paddingBottom: '20px'}}>
                        <SectionInput>
                            <div>
                                <div className={getBoxClass(1)}>
                                    <input
                                        type="text"
                                        style={{width: '333px'}}
                                        value={props.formState.formData.sectionId}
                                        maxLength={9}
                                        name="sectionId"
                                        onChange={props.handleProtocolNumberChange}
                                    />
                                </div>
                                <div className={getBoxClass(2)}/>
                                <div className={getBoxClass(3)}/>
                                <div className={getBoxClass(4)}/>
                                <div className={getBoxClass(5)}/>
                                <div className={getBoxClass(6)}/>
                                <div className={getBoxClass(7)}/>
                                <div className={getBoxClass(8)}/>
                                <div className={getBoxClass(9) + ' last'}/>
                                <br/>
                                <span style={{width: '72px'}}>Район</span>
                                <span style={{width: '72px'}}>Община</span>
                                <span style={{width: '72px'}}>Адм. ед.</span>
                                <span className='last' style={{width: '108px'}}>Секция</span>
                            </div>
                        </SectionInput>
                    </td>
                </tr>
            </tbody>
            </table>
            <p style={{fontSize: '20px'}}>
                {!props.sectionData.country? null : <>Държава:  <b>{props.sectionData.country}</b>, </>}
                {!props.sectionData.electionRegion? null : <>Изборен район: <b>{props.sectionData.electionRegion}</b>, </>}
                <br/>
                {!props.sectionData.municipality? null : <>Община: <b>{props.sectionData.municipality}</b>, </>}
                {!props.sectionData.town? null : <>Населено място: <b>{props.sectionData.town}</b>, </>}
                <br/>
                {!props.sectionData.cityRegion? null : <>Район: <b>{props.sectionData.cityRegion}</b>, </>}
                {!props.sectionData.address? null : <>Локация: <b>{props.sectionData.address}</b></>}
            </p>
            <table>
                <tbody>
                <tr>
                    <td style={{paddingTop: '20px'}}>Изпратен от (организация)</td>
                    <td style={{paddingTop: '20px'}}>{props.protocol.author.organization.name}</td>
                </tr>
                <tr>
                    <td>Машинна секция</td>
                    <td>{props.sectionData.isMachine? 'Да' : 'Не'}</td>
                </tr>
            </tbody>
            </table>
            <hr/>
        </>
    );
};