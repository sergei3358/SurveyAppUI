'use client'
import "../../question_set/[id]/questionSetDetail.css";
import "../../bootstrap.min.css";
import { Button, Form, Input, Table, TableProps, Modal, Select, Alert, Typography, Space, message } from 'antd';
import { LeftOutlined, FileProtectOutlined, EditOutlined, DeleteFilled, FileAddOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import React from "react";
import { addQuestionSetForSurvey, deleteQuestionSetForSurvey, updateQuestionSetForSurvey, getSurvey, updateSurvey, getIndividualCustomer, scheduleMeasurementsSurvey, getSurveyMeasurementBySurveyId } from "../../api/surveyService";
import { getQuestionSets } from "../../api/questionSetService";
import type { ColumnsType } from 'antd/es/table';
import { Helmet } from 'react-helmet';
import { time } from "console";

const { Title } = Typography;


interface Survey {
    surveyID: string;
    surveyName: string;
    surveyValidityStart: Date;
    surveyValidityEnd: Date;
    key: string;
    surveyImageURL: string;
    surveyImageWidth: number;
    surveyImageHeight: number;
    surveyLogoPosition: string;
    //questionSet: QuestionSet[];
}
interface QuestionSet {
    rankingSurvey: number;
    questionSetID: string;
    questionSetType: string;
    questionSetName: string;
    key: string
}

interface Measurements {
    key: React.Key;
    id: number;
    customer_name: string;
    interaction_type: string;
    status: string;
    completion_date: string;
    phone: string;
    email: string;
    order_number: string;
    survey_link: string;
}

interface Customer {
    key: React.Key;
    customerID: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
}


export default function Page({ params }: any) {

    const [form] = Form.useForm();
    var count = 0;
    const [pageTitle, setPageTitle] = useState<any>();

    const [surveyName, setSurveyName] = useState<any>();
    const [surveyValidityStart, setSurveyValidityStart] = useState<any>();
    const [surveyValidityEnd, setSurveyValidityEnd] = useState<any>();
    const [surveyImageURL, setSurveyImageURL] = useState<any>();
    const [surveyImageWidth, setSurveyImageWidth] = useState<any>();
    const [surveyImageHeight, setSurveyImageHeight] = useState<any>();
    const [surveyLogoPosition, setSurveyLogoPosition] = useState<any>();
    const [isEditSurvey, setIsEditSurvey] = useState(false);
    const [editQuestionSet, setQuestionSet] = useState<QuestionSet>();
    const [deleteQuestionSet, setdeleteQuestionSet] = useState<QuestionSet>();
    const [data, setData] = useState<QuestionSet[]>([]);
    const [isNewQuestionSet, setIsNewQuestionSetModalOpen] = useState(false);
    const [selectedQuestionSet, setSelectedQuestionSet] = useState<QuestionSet>();
    const [rankingSurvey, setRankingSurvey] = useState<any>(); // anketteki sıralama
    const [allQuestionSet, setAllQuestionSet] = useState<QuestionSet[]>([]);
    const [error, setError] = useState<any>(null);
    const [rankingError, setRankingError] = useState<any>(null);

    const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState<any>(null);
    const [isQuestionSetDeleted, setIsQuestionSetDeleted] = useState(false);
    const [isQuestionSetAdded, setIsQuestionSetAdded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSurveyUpdated, setIsSurveyUpdated] = useState(false);
    const [previousQuestionSetId, setPreviousQuestionSetId] = useState<any>();
    const [previousRankingSurvey, setPreviousRankingSurvey] = useState<number>();


    const [searchText, setSearchText] = useState<string>('');
    const [searchCustomerModel, setSearchCustomerModel] = useState('');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);


    const [surveyMeasurements, setSurveyMeasurements] = useState<Measurements[]>([]);
    const [surveyFilterMeasurements, setsurveyFilterMeasurements] = useState<Measurements[]>([]);
    const [selectedMeasurementRows, setSelectedMeasurementRows] = useState<Measurements[]>([]);

    const [counter, setCounter] = useState(1);




    const columns: TableProps<QuestionSet>['columns'] = [

        {
            title: 'Anketteki Sıra',
            dataIndex: 'rankingSurvey',
            width: "14.3%",
            align: "center",

        },
        {
            title: 'Soru Seti Türü',
            dataIndex: 'questionSetType',
            width: "14.3%",
            align: "center",
        },
        {
            title: 'Soru Seti',
            dataIndex: 'questionSetName',
            width: "14.3%",
            align: "center",
        },
        {
            title: 'Aksiyonlar',
            dataIndex: 'edit',
            render: (_text, record) => (
                <>
                    <Button style={{ marginRight: 10 }} icon={<EditOutlined />} onClick={() => showModal(record)}></Button>
                    <Button icon={<DeleteFilled />} onClick={() => handleDeleteQuestionSet(record)}></Button>
                </>
            ),
            width: "14.3%",
            align: "center",
        }
    ];

    const columnMeasurement: ColumnsType<Measurements> = [
        {
            title: 'ID(Anket)',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Müşteri',
            dataIndex: 'customer_name',
            key: 'customer_name'
        },
        {
            title: 'Etkileşim Türü',
            dataIndex: 'interaction_type',
            key: 'interaction_type'
        },
        {
            title: 'Durum',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Tamamlanma Tarihi',
            dataIndex: 'completion_date',
            key: 'completion_date'
        },
        {
            title: 'Telefon',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Sipariş',
            dataIndex: 'order_number',
            key: 'order_number'
        },
        {
            title: 'Anket Linki',
            dataIndex: 'survey_link',
            key: 'survey_link',
            render: (text: string) => <a href={text} target="_blank" rel="noopener noreferrer">{text}</a>
        },
        {
            title: 'Aksiyonlar',
            key: 'action',
            render: (_, _record) => (
                <div>
                    <Button icon={<EditOutlined />} style={{ marginRight: 8 }} />
                    <Button icon={<DeleteOutlined />} style={{ marginRight: 8 }} />
                </div>
            )
        }
    ];

    const customerColumns: ColumnsType<Customer> = [
        {
            title: 'Müşteri ID',
            dataIndex: 'customerID',
            key: 'customerID'
        },
        {
            title: 'Müşteri Adı',
            dataIndex: 'customerName',
            key: 'customerName'
        },
        {
            title: 'Müşteri E-posta',
            dataIndex: 'customerEmail',
            key: 'customerEmail'
        }
    ];

    const survey = {
        "surveyID": "",
        "questionSet": [
            {
                "questionSetName": "",
                "questionSetID": "",
                "questionSetType": "",
                "rankingSurvey": 0,
                // "questions": [
                //     {
                //         "questionID": "",
                //         "questionLine": "",
                //         "questionType": "",
                //         "questionText": "",
                //         "score": "",
                //         "key": "",
                //         "options": [
                //             {
                //                 "optionText": "",
                //                 "optionIndex": "",
                //             }
                //         ]
                //     }
                // ]
            }
        ]
    }


    // page get
    useEffect(() => {
        fetchData();
        setPageTitle("Survey " + params.id);
        fetchSurveyMeasurements();
        fetchIndividualCustomer();
        fetchQuestionSet();
    }, [isQuestionSetDeleted, isQuestionSetAdded, isSurveyUpdated]);

    const getMaxId = (measurements: { id: number }[]) => {
        return measurements.reduce((maxId, measurement) => {
            return measurement.id > maxId ? measurement.id : maxId;
        }, 0);
    };

    const fetchData = async () => {
        const survey = await getSurvey(params.id);
        setSurveyName(survey.survey_name);
        setSurveyValidityStart(new Date(survey.survey_validity_start).toISOString().split('T')[0]);
        setSurveyValidityEnd(new Date(survey.survey_validity_end).toISOString().split('T')[0]);
        setSurveyImageURL(survey.survey_image_url);
        const numberSurveyImageWidth = parseInt(survey.survey_image_width);
        const numberSurveyImageHeight = parseInt(survey.survey_image_height);
        setSurveyImageWidth(numberSurveyImageWidth);
        setSurveyImageHeight(numberSurveyImageHeight);
        setSurveyLogoPosition(survey.survey_logo_position);

        if (survey && survey.question_set_id) {
            const newQuestionSet = survey.map((e: any) => (
                {
                    rankingSurvey: e.ranking_survey,
                    questionSetID: e.question_set_id,
                    questionSetName: e.question_set_name,
                    questionSetType: e.question_set_type,
                    key: e.row_key
                }));
            setData(newQuestionSet);
        }


        setIsQuestionSetDeleted(false);
        setIsQuestionSetAdded(false);
    };

    const fetchSurveyMeasurements = async () => {
        const surveyMeasurements = await getSurveyMeasurementBySurveyId(params.id);
        setSurveyMeasurements(surveyMeasurements);
        setsurveyFilterMeasurements(surveyMeasurements);
    }

    const fetchIndividualCustomer = async () => {
        const customers = await getIndividualCustomer();
        setCustomers(customers);
    }

    const fetchQuestionSet = async () => {

        let questionSetList: QuestionSet[] = [];
        const question_set = await getQuestionSets();

        if (question_set) {
            question_set.forEach((e: any) => {
                let questionSet = {
                    rankingSurvey: e.ranking_survey,
                    questionSetName: e.question_set_name,
                    questionSetID: e.question_set_id,
                    questionSetType: e.question_set_type,
                    key: e.question_set_id,
                }
                questionSetList.push(questionSet);
            });
            setAllQuestionSet(questionSetList);
        }
    }



    function isNumeric(value: any): boolean {
        return /^-?\d+(\.\d+)?$/.test(value);
    }


    // header button
    const handleEditButtonClick = () => {
        setIsEditSurvey(true);

    };
    // update survey buttons
    const handleSaveButtonClick = async () => {
        setIsEditSurvey(false);

        let survey: Survey = {
            surveyID: params.id,
            surveyName: surveyName,
            surveyValidityEnd: surveyValidityEnd,
            surveyValidityStart: surveyValidityStart,
            key: params.id,
            surveyImageURL: surveyImageURL,
            surveyImageWidth: surveyImageWidth,
            surveyImageHeight: surveyImageHeight,
            surveyLogoPosition: surveyLogoPosition,
            //questionSet: [...data]
        }

        try {
            const response = await updateSurvey(survey, params.id);
            if (response) {
                console.log("Survey güncellendi");
                setIsSurveyUpdated(true);
                window.location.reload();

            } else {
                console.error('Survey güncellenirken bir hata oldu');
            }
        } catch (error) {
            console.error('Survey güncellenirlen bir hata oldu ', error);
        }
    };

    const handleSaveCancelClick = () => {
        setIsEditSurvey(false);
    };

    //survey logo edit
    const handleLogoURLChange = (e: { target: { value: any; }; }) => {
        setSurveyImageURL(e.target.value);
    };
    const handleLogoWidthChange = (e: { target: { value: any; }; }) => {
        setSurveyImageWidth(e.target.value);
    };
    const handleLogoHeightChange = (e: { target: { value: any; }; }) => {
        setSurveyImageHeight(e.target.value);
    };
    const handleLogoPositionChange = (e: { target: { value: any; }; }) => {
        setSurveyLogoPosition(e.target.value);
    };

    // header edit
    const handleSurveyNameChange = (e: { target: { value: any; }; }) => {
        setSurveyName(e.target.value);
    };
    const handleSurveyValidityStartChange = (e: { target: { value: any; }; }) => {
        setSurveyValidityStart(e.target.value);
    };
    const handleSurveyValidityEndChange = (e: { target: { value: any; }; }) => {
        setSurveyValidityEnd(e.target.value);
    };



    const questionSetAddModalOpen = () => {
        setIsNewQuestionSetModalOpen(true);
    };
    const handleDeleteQuestionSet = (record: QuestionSet) => {
        setdeleteQuestionSet(record);
        setDeleteConfirmationVisible(true);
    };
    const handleDeleteConfirmationOk = async () => {
        if (deleteQuestionSet?.questionSetID) {
            try {
                const response = await deleteQuestionSetForSurvey(params.id, deleteQuestionSet.questionSetID);
                if (response) {
                    setIsQuestionSetDeleted(true);
                    window.location.reload();
                } else {
                    console.error('Question set silinirken bir hata oluştu.');
                }
            } catch (error) {
                console.error('Question set silinirken bir hata oluştu:', error);
            }
        }
        setDeleteConfirmationVisible(false);
    };

    const handleDeleteConfirmationCancel = () => {
        setDeleteConfirmationVisible(false);
    };

    const addQuestionSetModalOk = async () => {
        if (selectedQuestionSet?.key) {
            const isSet = data.filter(x => x.key == selectedQuestionSet.key);
            if (isSet.length == 0) {
                const isSetRanking = data.filter(x => x.rankingSurvey == rankingSurvey);
                if (isNumeric(rankingSurvey) && isSetRanking.length == 0) {
                    survey.surveyID = params.id;
                    selectedQuestionSet.rankingSurvey = rankingSurvey;
                    const newData = [selectedQuestionSet];
                    survey.questionSet = newData;

                    try {
                        const response = await addQuestionSetForSurvey(survey, params.id);

                        if (response) {
                            setIsQuestionSetAdded(true);
                            setIsNewQuestionSetModalOpen(false);

                        } else {
                            console.error('Question set eklenirken bir hata oluştu.');
                        }
                    } catch (error) {
                        console.error('Question set eklenirken bir hata oluştu:', error);
                    }
                }
                else {
                    setRankingError(true);
                    setTimeout(() => {
                        setRankingError(false);
                    }, 3000);

                }
            } else {
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 3000);
            }
        }
    };

    const closeAlert = () => {
        setError(null);
    };
    const closeRankingAlert = () => {
        setRankingError(null);
    };
    const addQuestionModelCancel = () => {
        setIsNewQuestionSetModalOpen(false);
    };

    // popup button
    const showModal = (record: QuestionSet) => {
        const newQuestion: QuestionSet = {
            rankingSurvey: record.rankingSurvey,
            questionSetID: record.questionSetID,
            questionSetType: record.questionSetType,
            questionSetName: record.questionSetName,
            key: record.questionSetID
        };
        setQuestionSet(newQuestion);
        setPreviousQuestionSetId(record.questionSetID);
        setPreviousRankingSurvey(record.rankingSurvey);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = async () => {
        if (editQuestionSet) {
            const isSet = data.filter(x => x.key == editQuestionSet.questionSetID);
            if (previousQuestionSetId == editQuestionSet.questionSetID || isSet.length == 0) {
                const isSetRanking = data.filter(x => x.rankingSurvey == editQuestionSet.rankingSurvey);
                if ((previousRankingSurvey == editQuestionSet.rankingSurvey || isSetRanking.length == 0) && isNumeric(editQuestionSet.rankingSurvey)) {
                    try {
                        const data = {
                            previousQuestionSetId: previousQuestionSetId,
                            rankingSurvey: editQuestionSet.rankingSurvey,
                            questionSetID: editQuestionSet.questionSetID,
                            questionSetName: editQuestionSet.questionSetName,
                            questionSetType: editQuestionSet.questionSetType,
                            key: editQuestionSet.key
                        };
                        const response = await updateQuestionSetForSurvey(data, params.id);
                        if (response) {
                            setIsQuestionSetAdded(true);
                        } else {
                            console.error('Question set update edilirken bir hata oluştu.');
                        }
                    } catch (error) {
                        console.error('Question set update edilirken bir hata oluştu:', error);
                    }
                    setIsModalOpen(false);
                }
                else {
                    setRankingError(true);
                    setTimeout(() => {
                        setRankingError(false);
                    }, 3000);
                }


            }
            else {
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 3000);
            }
        }
    };

    const rankingSurveyChange = (value: any, record?: QuestionSet) => {
        if (record) {
            const newQuestionSet: QuestionSet = { ...record, rankingSurvey: value };
            setQuestionSet(newQuestionSet);
        }
    };

    const updateQuestionSet = (newRecord?: QuestionSet, oldRecord?: QuestionSet) => {
        if (oldRecord) {
            const newQuestionSet: QuestionSet = {
                ...oldRecord, questionSetID: newRecord && newRecord.questionSetID ? newRecord.questionSetID.toString() : '',
                questionSetName: newRecord && newRecord.questionSetName ? newRecord.questionSetName.toString() : '',
            };
            setQuestionSet(newQuestionSet);
        }
    };

    //Customer Filter
    const handleSearch = (value: string) => {
        setSearchText(value);
        const filteredData = surveyMeasurements.filter(e =>
            e.customer_name != null && e.customer_name == value
        );
        if (value != "") {
            setsurveyFilterMeasurements(filteredData);
        } else {
            setsurveyFilterMeasurements(surveyMeasurements);
        }



    };
    
    // Customer Selection
    const handleSelectCustomer = (record: Customer) => {
        console.log(record);
        var maxId = getMaxId(surveyFilterMeasurements);
        const newMeasurement: Measurements = {
            key: record.customerID + new Date().toISOString(),
            customer_name: record.customerName,
            phone: record.customerPhone,
            email: record.customerEmail,
            order_number: record.customerID,
            id: ++maxId,
            interaction_type: "",
            status: "",
            completion_date: "",
            survey_link: ""
        };

        console.log(newMeasurement.key);
        setsurveyFilterMeasurements(prevMeasurements => [...prevMeasurements, newMeasurement]);
        setIsModalVisible(false);
    };

    const handleCustomerModelSearch = (e: any) => {
        setSearchCustomerModel(e.target.value);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.customerName.toLowerCase().includes(searchCustomerModel.toLowerCase())
    );

    //Schedule Measurements
    const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: Measurements[]) => {
        setSelectedMeasurementRows(newSelectedRows);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const scheduleMeasurements = async () => {
        const customerInfo = selectedMeasurementRows.map(row => ({
            customer_name: row.customer_name,
            email: row.email,
            survey_link: row.survey_link
        }));

        const questionSetIDs = data.map(item => item.questionSetID);

        const requestBody = {
            customerInfo: customerInfo,
            questionSetIDs: questionSetIDs,
            surveyID: params.id
        }

        try {
            const response = await scheduleMeasurementsSurvey(requestBody);
            if (response) {
                console.log("Çizelgelendi.");
                message.success('Mailler gönderildi');
                setSelectedRowKeys([]);
                setSelectedMeasurementRows([]);
            } else {
                console.error('Çizelgeleme yapılırken bir hata oldu');
            }
        } catch (error) {
            console.error('Çizelgeleme yapılırken bir hata oldu ', error);
        }

    };



    return (
        <div className='container mt-5 mb-5'>

            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>
            {/* HEADER --> */}
            <div style={{ height: 45, borderRight: '1px solid black', borderBottom: '1px solid black' }}>
                <Button type="default" style={{
                    float: 'left',
                    marginRight: 5,
                    border: 'none',
                    color: 'blue',
                    fontSize: 10
                }}
                    icon={<LeftOutlined />}
                    href="http://localhost:3000/surveys"
                >
                    Geri
                </Button>
                <span style={{ marginLeft: 10, fontWeight: "bolder", fontSize: 15 }}>Anket Detayı</span>


                <div style={{ float: 'right', display: 'inline-flex' }}>
                    <Button className="bg bg-primary" type="default" style={{ marginRight: 10, color: 'white' }} onClick={handleEditButtonClick}>
                        Düzenle
                    </Button>

                </div>
            </div>

            <Form
                form={form}
                layout="vertical" style={{ marginTop: 10 }}
            >

                <div style={{ display: 'flex', marginTop: 40 }}>
                    <FileProtectOutlined style={{ color: "#0d6efd", fontSize: '70px', marginRight: 30 }} />
                    <Form.Item style={{ width: 100, marginRight: 20, marginLeft: 25 }}>
                        <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Tanıtıcı</label>
                        <Input style={{ border: "none", boxShadow: "0 0 0 0" }} readOnly value={params.id} placeholder="-" />
                    </Form.Item>

                    <Form.Item style={{ width: 250 }}>
                        <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Geçerlilik Başlangıç Tarihi</label>
                        <Input type="date" style={{ border: "none", boxShadow: "0 0 0 0" }} readOnly value={surveyValidityStart} placeholder="-" />
                    </Form.Item>
                    <Form.Item style={{ width: 250 }}>
                        <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Geçerlilik Bitiş Tarihi</label>
                        <Input type="date" style={{ border: "none", boxShadow: "0 0 0 0" }} readOnly value={surveyValidityEnd} placeholder="-" />
                    </Form.Item>
                    <Form.Item style={{ width: 400, marginRight: 20 }}>
                        <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Anket Adı</label>
                        <Input style={{ border: "none", boxShadow: "0 0 0 0" }} readOnly value={surveyName} placeholder="-" />
                    </Form.Item>
                </div>

            </Form>
            {/* HEADER <--*/}
            <Button
                onClick={questionSetAddModalOpen}
                icon={<FileAddOutlined />}
                style={{
                    color: "#0d6efd",
                    fontSize: 15,
                    border: "none",
                    float: "right",
                    marginBottom: 20
                }}>Soru Seti Ekle
            </Button>
            <Table columns={columns} dataSource={data} />

            {/* EDIT POPUP -->*/}
            <Modal
                width={600}
                title="Soru Düzenleme"
                open={isModalOpen}
                okType='default'
                onOk={handleOk}
                onCancel={handleCancel}
                okText='Kaydet ve Kapat'
                cancelText='İptal'
                afterClose={() => {
                    setError(false);
                    setRankingError(false);
                }}
            >
                {error && (
                    <Alert afterClose={closeAlert} closable message="Aynı soru seti mevcut." description={error} type="error" showIcon />
                )}
                {rankingError && (
                    <Alert afterClose={closeRankingAlert} closable message="Var olmayan anket sıralaması ve numeric değer giriniz." description={rankingError} type="error" showIcon />
                )}
                {/* Modal içeriği */}
                <p style={{ fontSize: 15, fontWeight: "bolder" }} className='mt-2'>Soru Seti</p>
                <Select
                    showSearch
                    style={{
                        width: "50%",
                    }}
                    onChange={(e) => {
                        setError(false);
                        const selected = allQuestionSet.filter(x => x.questionSetID == e);
                        if (selected[0]) {
                            (selected[0]);
                            updateQuestionSet(selected[0], editQuestionSet);
                        }
                    }}
                    placeholder="Search to Select Question Set"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    value={editQuestionSet?.questionSetName}
                    options={
                        allQuestionSet.map((e: any) => ({
                            value: e.questionSetID,
                            label: e.questionSetName
                        }))
                    }
                />
                <p style={{ fontSize: 15, fontWeight: "bolder" }} className='mt-2'>Anketteki Sıralama</p>
                <Input
                    required
                    style={{ width: "50%" }}
                    value={editQuestionSet?.rankingSurvey}
                    onChange={(e) => {
                        setRankingError(false);
                        rankingSurveyChange(e.target.value, editQuestionSet);
                    }}
                />
            </Modal>
            {/* EDIT POPUP <--*/}

            <Modal
                width={500}
                title="Soru Seti Ekle"
                open={isNewQuestionSet}
                okType='default'
                onOk={addQuestionSetModalOk}
                onCancel={addQuestionModelCancel}
                okText='Kaydet'
                cancelText='İptal'
                afterClose={() => {
                    setSelectedQuestionSet(undefined);
                    setRankingSurvey('');
                    setError(false);
                    setRankingError(false);
                }}>
                {error && (
                    <Alert afterClose={closeAlert} closable message="Aynı soru seti mevcut." description={error} type="error" showIcon />
                )}
                {rankingError && (
                    <Alert afterClose={closeAlert} closable message="Var olmayan anket sıralaması ve numeric değer giriniz." description={error} type="error" showIcon />
                )}
                {/* Modal içeriği */}
                <p style={{ fontSize: 15, fontWeight: "bolder" }} className='mt-2'>Soru Seti</p>
                <Select
                    showSearch
                    style={{
                        width: "50%",
                    }}
                    onChange={(e) => {
                        setError(false);
                        const selected = allQuestionSet.filter(x => x.questionSetID == e);
                        if (selected[0]) {
                            setSelectedQuestionSet(selected[0]);
                        }
                    }}
                    placeholder="Search to Select Question Set"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    value={selectedQuestionSet?.questionSetName}
                    options={
                        allQuestionSet.map((e: any) => ({
                            value: e.questionSetID,
                            label: e.questionSetName
                        }))
                    }
                />
                <p style={{ fontSize: 15, fontWeight: "bolder" }} className='mt-2'>Anketteki Sıralaması</p>
                <Input
                    required
                    style={{ width: "50%" }}
                    value={rankingSurvey}
                    onChange={(e) => {
                        setRankingError(false);
                        setRankingSurvey(e.target.value);
                    }}
                />
            </Modal>
            <Modal
                title="Seçilen soru setini silmek istediğinize emin misiniz?"
                open={isDeleteConfirmationVisible}
                onOk={handleDeleteConfirmationOk}
                onCancel={handleDeleteConfirmationCancel}
                okText="Evet"
                cancelText="Hayır"
                okType="default"
            >
            </Modal>

            <Modal
                width={1000}
                title="Anket Güncelle"
                open={isEditSurvey}
                okType='default'
                onOk={handleSaveButtonClick}
                onCancel={handleSaveCancelClick}
                okText='Kaydet'
                cancelText='İptal'
            >


                <Form
                    form={form}
                    layout="vertical" style={{ marginTop: 20 }}>

                    <div className="row">
                        <div className="col-md-3">
                            <Form.Item style={{ marginBottom: 20 }}>
                                <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Tanıtıcı</label>
                                <Input style={{ border: "none", boxShadow: "0 0 0 0" }} readOnly value={params.id} placeholder="-" />
                            </Form.Item>
                        </div>
                        <div className="col-md-3">
                            <Form.Item style={{ marginBottom: 20 }}>
                                <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Başlangıç Tarihi</label>
                                <Input type="date" style={{ borderColor: '#0d6efd' }} readOnly={false} onChange={handleSurveyValidityStartChange} value={surveyValidityStart} placeholder="-" />
                            </Form.Item>
                        </div>
                        <div className="col-md-3">
                            <Form.Item style={{ marginBottom: 20 }}>
                                <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Geçerlilik Bitiş Tarihi</label>
                                <Input type="date" style={{ borderColor: '#0d6efd' }} readOnly={false} onChange={handleSurveyValidityEndChange} value={surveyValidityEnd} placeholder="-" />
                            </Form.Item>
                        </div>
                        <div className="col-md-3">
                            <Form.Item style={{ marginBottom: 20 }}>
                                <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Geçerlilik Anket Adı</label>
                                <Input style={{ borderColor: '#0d6efd' }} onChange={handleSurveyNameChange} readOnly={false} value={surveyName} placeholder="-" />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="row">
                        <p style={{ fontWeight: 'bold', marginLeft: 10, fontSize: 15 }}>Logo Bilgileri</p>
                        <div className="col-md-6">
                            <Form.Item style={{ marginBottom: 5 }}>
                                <label style={{ fontWeight: 'bold', marginLeft: 10 }}>URL</label>
                                <Input style={{ borderColor: '#0d6efd' }} onChange={handleLogoURLChange} value={surveyImageURL} />
                            </Form.Item>
                        </div>
                        <div className="col-md-2">
                            <Form.Item style={{ marginBottom: 20 }}>
                                <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Yükseklik</label>
                                <Input style={{ borderColor: '#0d6efd' }} onChange={handleLogoHeightChange} value={surveyImageHeight} />
                            </Form.Item>
                        </div>
                        <div className="col-md-2">
                            <Form.Item style={{ marginBottom: 20 }}>
                                <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Genişlik</label>
                                <Input style={{ borderColor: '#0d6efd' }} onChange={handleLogoWidthChange} value={surveyImageWidth} />
                            </Form.Item>
                        </div>
                        <div className="col-md-2">
                            <Form.Item style={{ marginBottom: 20 }}>
                                <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Logo Konumu</label>
                                <Input style={{ borderColor: '#0d6efd' }} onChange={handleLogoPositionChange} value={surveyLogoPosition} />
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>
            <div style={{ padding: '20px' }}>
                <Title level={4}>Ölçümlemeler</Title>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <Space>
                        <Input
                            placeholder="Müşteri Ara"
                            style={{ width: '150px' }}
                            value={searchText}
                            onChange={e => handleSearch(e.target.value)}
                        />
                        <Button onClick={() => setIsModalVisible(true)} style={{
                            color: "#0d6efd",
                            border: "none",
                        }}>Müşteri Seç</Button>
                        <Button onClick={scheduleMeasurements} disabled={!hasSelected} icon={<CalendarOutlined />} style={{
                            color: "#0d6efd",
                            border: "none",
                        }}>Seçilen Satırları Çizelgele</Button>
                    </Space>
                </div>
                <Table<Measurements> rowSelection={rowSelection} columns={columnMeasurement} dataSource={surveyFilterMeasurements} rowKey="id" />

                <Modal
                    title="Müşteri Seç"
                    open={isModalVisible}
                    onCancel={() => {
                        setIsModalVisible(false);
                        setSearchCustomerModel('');
                    }
                    }
                    footer={null}
                >
                    <Input
                        placeholder="Müşteri Seç"
                        value={searchCustomerModel}
                        onChange={handleCustomerModelSearch}
                        style={{ marginBottom: 16, display: 'block' }}
                    />
                    <Table<Customer>
                        columns={customerColumns}
                        dataSource={filteredCustomers}
                        rowKey="customerID"
                        onRow={(record) => ({
                            onClick: () => handleSelectCustomer(record)
                        })}
                    />
                </Modal>
            </div>
        </div>
    );
}