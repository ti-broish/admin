import React from 'react';
import ProtocolPhotos from './ProtocolPhotos';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const ProtocolInfoSection = styled.div`
    width: 50vw;
    height: 100vh;
    overflow-y: auto;
    position: absolute;
    top: 0;
    right: 0;
`;

const ProtocolDetails = styled.div`
    padding: 20px;

    hr {
        margin: 20px 0;
        border: 1px solid #ddd;
        border-top: 0;
    }
`;

const SectionHeader = styled.div`
    //padding: 10px;
    background-color: rgb(56,222,203);
    color: white;
`;

const BackButton = styled.button`
    display: inline-block;
    color: white;
    border: none;
    background: none;
    font-size: 36px;
    cursor: pointer;
    padding: 15px;
    border-right: 1px solid white;
    margin-right: 20px;
`;

export default props => {

    const partyDropDown = selectedIndex => {
        const parties = [
            'ПАТРИОТИ ЗА ВАЛЕРИ СИМЕОНОВ',
            'ПЪТ НА МЛАДИТЕ (НДСВ и НОВОТО ВРЕМЕ)',
            'ПП ВМРО – БЪЛГАРСКО НАЦИОНАЛНО ДВИЖЕНИЕ',
            'ИК за Ваня Руменова Григорова',
            'партия на ЗЕЛЕНИТЕ',
            'ПП ВОЛТ',
            'ВЪЗХОД	1',
            'ИК за Десислава Петрова Иванчева',
            'ПП ГЕРБ',
            'ДЕМОКРАТИЧНА БЪЛГАРИЯ – ОБЕДИНЕНИЕ',
            'АТАКА',
            'ИК за Минчо Христов Куминев',
            'БСП ЗА БЪЛГАРИЯ',
            'Движение за права и свободи - ДПС',
            'ВОЛЯ – Българските Родолюбци',
            'Движение 21',
            'ПП „ДВИЖЕНИЕ ПРЕЗАРЕДИ БЪЛГАРИЯ“',
            'ПП „Възраждане“',
        ];

        return(
            <select>
                {parties.map((party, i) => <option selected={i===selectedIndex}>{party}</option>)}
            </select>
        );
    };

    return(
        <div>
            <ProtocolPhotos protocol={props.protocol}/>
            <ProtocolInfoSection>
                <SectionHeader>
                    <BackButton onClick={props.returnProtocol}>
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </BackButton>
                    <h1 style={{display: 'inline-block'}}>Секция 234602054</h1>
                </SectionHeader>
                <ProtocolDetails>
                    <h1>СЕКЦИОННАТА ИЗБИРАТЕЛНА КОМИСИЯ УСТАНОВИ</h1>
                    <table>
                        <tr>
                            <td>А. Брой на бюлетините, получени по реда на чл. 215, ал. 1, т. 2 от ИК</td>
                            <td>
                                <input
                                    type="text"
                                    value="700"
                                />
                            </td>
                        </tr>
                    </table>
                    <button>Приеми</button>
                    <button>Отхвърли</button>
                    <hr/>
                    <h1>ДАННИ ОТ ИЗБИРАТЕЛНИ СПИСЪЦИ</h1>
                    <table>
                        <tr>
                            <td>1. Брой на избирателите според част І и част ІІ на избирателния списък при предаването му на СИК</td>
                            <td>
                                <input
                                    type="text"
                                    value="677"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>2. Брой на избирателите, вписани в допълнителната страница (под чертата) на избирателния списък (част І и част ІІ) в изборния ден</td>
                            <td>
                                <input
                                    type="text"
                                    value="6"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>3. Брой на гласувалите избиратели според положените подписи в избирателния списък (част І и част ІІ), включително и подписите в допълнителната страница/и (под чертата)</td>
                            <td>
                                <input
                                    type="text"
                                    value="245"
                                />
                            </td>
                        </tr>
                    </table>
                    <button>Приеми</button>
                    <button>Отхвърли</button>
                    <hr/>
                    <h1>ДАННИ ИЗВЪН ИЗБИРАТЕЛНИ СПИСЪЦИ И СЪДЪРЖАНИЕТО НА ИЗБИРАТЕЛНАТА КУТИЯ</h1>
                    <h2>4. Бюлетини извън избирателната кутия</h2>
                    <table>
                        <tr>
                            <td>4.а) брой на неизползваните бюлетини</td>
                            <td>
                                <input
                                    type="text"
                                    value="454"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>4.б) брой на унищожените от СИК бюлетини по други поводи (за създаване на образци за таблата пред изборното помещение и увредени механично при откъсване от кочана и станали неизползваеми) </td>
                            <td>
                                <input
                                    type="text"
                                    value="1"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>4.в) брой на недействителните бюлетини по чл. 265, ал. 5 от ИК (когато номерът на бюлетината не съответства на номер в кочана)</td>
                            <td>
                                <input
                                    type="text"
                                    value="0"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>4.г) брой на недействителните бюлетини по чл. 227 от ИК (при които е използвана възпроизвеждаща техника) </td>
                            <td>
                                <input
                                    type="text"
                                    value="0"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>4.д) брой на недействителните бюлетини по чл. 228 от ИК (показан публично вот след гласуване)</td>
                            <td>
                                <input
                                    type="text"
                                    value="0"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>4.е) брой на сгрешените бюлетини</td>
                            <td>
                                <input
                                    type="text"
                                    value="0"
                                />
                            </td>
                        </tr>
                    </table>
                    <button>Приеми</button>
                    <button>Отхвърли</button>
                    <hr/>
                    <h1>СЛЕД КАТО ОТВОРИ ИЗБИРАТЕЛНАТА КУТИЯ, СИК УСТАНОВИ</h1>
                    <table>
                        <tr>
                            <td>5. Брой на намерените в избирателната кутия бюлетини</td>
                            <td>
                                <input
                                    type="text"
                                    value="245"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>6. Брой намерени в избирателната кутия недействителни гласове (бюлетини)</td>
                            <td>
                                <input
                                    type="text"
                                    value="0"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>7. Общ брой намерени в избирателната кутия действителни гласове (бюлетини)</td>
                            <td>
                                <input
                                    type="text"
                                    value="245"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>7.1 брой на действителните гласове, подадени за кандидатските листи на партии, коалиции и инициативни комитети </td>
                            <td>
                                <input
                                    type="text"
                                    value="245"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>7.2 брой действителни гласове (отбелязвания) само в квадратчето „Не подкрепям никого“</td>
                            <td>
                                <input
                                    type="text"
                                    value="0"
                                />
                            </td>
                        </tr>
                    </table>
                    <button>Приеми</button>
                    <button>Отхвърли</button>
                    <hr/>
                    <h1>8. РАЗПРЕДЕЛЕНИЕ НА ГЛАСОВЕТЕ ПО КАНДИДАТСКИ ЛИСТИ</h1>
                    <table>
                        <tr>
                            <td>{partyDropDown(0)}</td>
                            <td><input type="text" value="3"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(1)}</td>
                            <td><input type="text" value="3"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(2)}</td>
                            <td><input type="text" value="12"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(3)}</td>
                            <td><input type="text" value="1"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(4)}</td>
                            <td><input type="text" value="2"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(5)}</td>
                            <td><input type="text" value="1"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(6)}</td>
                            <td><input type="text" value="1"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(7)}</td>
                            <td><input type="text" value="13"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(8)}</td>
                            <td><input type="text" value="52"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(9)}</td>
                            <td><input type="text" value="48"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(10)}</td>
                            <td><input type="text" value="4"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(11)}</td>
                            <td><input type="text" value="10"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(12)}</td>
                            <td><input type="text" value="60"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(13)}</td>
                            <td><input type="text" value="1"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(14)}</td>
                            <td><input type="text" value="4"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(15)}</td>
                            <td><input type="text" value="21"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(16)}</td>
                            <td><input type="text" value="1"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td>{partyDropDown(17)}</td>
                            <td><input type="text" value="8"/></td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                        <tr>
                            <td colSpan="3">
                                <button>Добави</button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">9. Бюлетини, в които не е отбелязан вотът на избирателя (празни бюлетини), бюлетини, в които е гласувано в повече от едно квадратче; бюлетини, в които не може да се установи еднозначно вотът на избирателя и други видове недействителни гласове</td>
                            <td><input type="text" value="0"/></td>
                        </tr>
                    </table>
                    <button>Приеми</button>
                    <button>Отхвърли</button>
                    <hr/>
                    <button>Приеми протокол</button>
                    <button>Отхвърли протокол</button>
                </ProtocolDetails>
            </ProtocolInfoSection>
        </div>
    );
};