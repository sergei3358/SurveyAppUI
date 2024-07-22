'use client'
import "../../question_set/[id]/questionSetDetail.css";
import "../../bootstrap.min.css";
import { Alert, Button, Dropdown, Form, Input, InputRef, Menu, MenuItemProps, MenuProps, Modal, Radio, Select, SelectProps, Space, Switch, Table, TableProps } from 'antd';
import { LeftOutlined, EditOutlined, FileAddOutlined, ProjectTwoTone, PlusOutlined } from '@ant-design/icons';
import { Key, useEffect, useRef, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { createQuestionForQuestionSet, updateQuestionForQuestionSet, updateQuestionSet, getQuestionSet } from '../../api/questionSetService';


interface Question {
     questionID: string;
     questionLine: number;
     questionType: string;
     questionText: string;
     score: string;
     key: Key;
     options: Option[];
}
interface Option {
     optionId: string;
     optionText: string;
     optionIndex: number;
}

interface InputItem {
     order: string;
     score: string;
     definition: string;
}

export default function Page({ params }: any) {

     const [form] = Form.useForm();
     const [questionSetName, setquestionSetName] = useState<any>();
     const [questionSetID, setquestionSetID] = useState<any>();
     const [questionSetType, setQuestionSetType] = useState<any>();
     const [isUpdateQuestionSet, setIsUpdateQuestionSet] = useState(false);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [data, setData] = useState<Question[]>([]);
     const [editQuestions, setQuestions] = useState<Question>();
     const [isNewQuestionModalOpen, setIsNewQuestionModalOpen] = useState(false);
     const [isUpdatedQuestion, setIsUpdatedQuestion] = useState(false);
     const [numericError, setNumericError] = useState<any>(null);
     const [previousQuestionLine, setPreviousQuestionLine] = useState<number>();


     const questionSet = {
          "questionSetName": "",
          "questionSetID": "",
          "questionSetType": "",
          "questions": [
               {
                    "questionID": "",
                    "questionLine": 0,
                    "questionType": "",
                    "questionText": "",
                    "score": "",
                    "options": [
                         {
                              "optionText": "",
                              "optionIndex": 0
                         }
                    ]
               }
          ]
     };



     const expandedRowRender = (record: Question) => (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
               <p style={{ fontWeight: 'bold' }}>Seçenekler :</p>
               {record.options.map((option: any) => (
                    <TextArea rows={3} style={{ borderColor: '#0d6efd' }} value={option.optionText} key={option.optionIndex}

                    />
               ))}
          </div>
     );
     const columns: TableProps<Question>['columns'] = [

          {
               title: 'Tanıtıcı',
               dataIndex: 'questionID',
               width: "14.3%",
               align: "center",

          },
          {
               title: 'Sıra',
               dataIndex: 'questionLine',
               width: "14.3%",
               align: "center",
          },
          {
               title: 'Soru Türü',
               dataIndex: 'questionType',
               width: "14.3%",
               align: "center",
          },
          {
               title: 'Soru',
               dataIndex: 'questionText',
               width: "14.3%",
               align: "center",
          },
          {
               title: 'Puan Ağırlık Değeri',
               dataIndex: 'score',
               width: "14.3%",
               align: "center",
          },
          {
               title: 'Düzenle',
               dataIndex: 'edit',
               render: (text, record) => (
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)}></Button>
               ),
               width: "14.3%",
               align: "center",
          },

          // {
          //      title: 'Seçenekler',
          //      key: 'options',
          //      width: "14.3%",
          //      align: "center",
          //      render: (text, record) => (
          //           <Select style={{ width: 100 }}>
          //                {record.options.map((option: any) => (
          //                     counter = counter + 1,
          //                     <Select.Option key={counter}>
          //                          <span>{option.optionText}</span>
          //                     </Select.Option>
          //                ))}
          //           </Select>
          //      ),
          // }
     ];

     const [answerType, setAnswerType] = useState<string>('');
     const [questionLine, setquestionLine] = useState<any>();
     const [questionText, setquestionText] = useState<string>('');
     const [score, setScore] = useState<string>('');
     const [active, setActive] = useState<boolean>(true);




     const list = ['List Box', 'Radio Button', 'Free Text', 'Multiple Choice'];
     const options: SelectProps['options'] = [];
     list.forEach(element => {
          options.push({
               value: element,
               label: element,
          });
     })

     // page get
     useEffect(() => {
          fetchData();
     }, [isUpdatedQuestion]);

     const fetchData = async () => {

          const questionSet = await getQuestionSet(params.id);


          const newData: any[] = [];
          let question_set_id: any;
          let question_set_name: any;
          let question_set_type: any;

          Object.values(questionSet).forEach((questions: any) => {
               const options: any[] = [];

               questions.forEach((question: any) => {

                    const { option_id, option_index, option_text } = question;

                    if (option_id !== null) {
                         const option = {
                              optionId: option_id,
                              optionIndex: option_index,
                              optionText: option_text
                         }
                         options.push(option);
                    }
               });

               options.sort((a, b) => a.optionIndex - b.optionIndex);

               if (questions[0].question_id !== null) {
                    newData.push({
                         questionID: questions[0].question_id,
                         questionLine: questions[0].question_line,
                         questionType: questions[0].question_type,
                         questionText: questions[0].question_text,
                         score: questions[0].score,
                         key: questions[0].question_id,
                         options: options
                    });
               }

               question_set_id = questions[0].question_set_id;
               question_set_name = questions[0].question_set_name;
               question_set_type = questions[0].question_set_type;
          });
          setquestionSetID(question_set_id);
          setquestionSetName(question_set_name);
          setQuestionSetType(question_set_type);
          setData(newData);
     };

     function isNumeric(value: any): boolean {
          return /^-?\d+(\.\d+)?$/.test(value);
     }



     // header button
     const handleEditButtonClick = () => {
          setIsUpdateQuestionSet(true);
     };
     const handleSaveButtonClick = async () => {
          setIsUpdateQuestionSet(false);

          questionSet.questionSetID = questionSetID;
          questionSet.questionSetName = questionSetName;
          questionSet.questionSetType = questionSetType;

          try {
               const response = await updateQuestionSet(questionSet, params.id);

               if (response) {
                    console.log('Data updated successfully:', response);
               } else {
                    console.error('Question set update edilirken bir hata oluştu.');
               }
          } catch (error) {
               console.error('Question set update edilirken bir hata oluştu:', error);
          }
     };
     const handleSaveCancelClick = () => {
          setIsUpdateQuestionSet(false);
     };

     // header edit
     const handleQuestionTypeChange = (e: { target: { value: any; }; }) => {
          setQuestionSetType(e.target.value);
     };

     const handleQuestionSetNameChange = (e: { target: { value: any; }; }) => {
          setquestionSetName(e.target.value);
     };

     // table button
     const showNewQuestionModal = () => {
          setIsNewQuestionModalOpen(true);
     };

     const handleAnswerTypeChange = (value: string) => {
          setAnswerType(value);
     };
     const newQuestionModalOk = async () => {
          const isSet = data.filter(x => x.questionLine == questionLine);

          if (isNumeric(questionLine) && isSet.length == 0) {
               const newQuestion: Question = {
                    questionID: (Math.floor(Math.random() * (200 - 100 + 1)) + 100).toString(), // Yeni sorunun ID'si gerektiğine bağlı olarak buraya bir değer atanabilir
                    questionLine: questionLine, // Sıra
                    questionType: answerType, // Soru Türü
                    questionText: questionText || "", // Soru
                    score: score || "", // Puan Ağırlık Çarpanı
                    key: "newKey", // Yeni soru için bir anahtar atanabilir
                    options: inputs.map((input, index) => ({ // Seçenekler
                         optionId: (Math.floor(Math.random() * (200 - 100 + 1)) + 100).toString(),
                         optionText: input.definition, // Tanım
                         optionIndex: index // Seçeneklerin index'leri belirlenmeli
                    }))
               };

               try {
                    const response = await createQuestionForQuestionSet(newQuestion, params.id);

                    if (response) {
                         console.log('Data updated successfully:', response);
                         setIsNewQuestionModalOpen(false);
                         window.location.reload();
                    } else {
                         console.error('Question set için soru oluşturulurken bir hata oluştu.');
                    }
               } catch (error) {
                    console.error('Question set için soru oluşturulurken bir hata oluştu:', error);
               }

          }
          else {
               setNumericError(true);
               setTimeout(() => {
                    setNumericError(false);
               }, 3000);

          }

     };

     const newQuestionModelCancel = () => {
          setIsNewQuestionModalOpen(false);
     };

     const closeNumericAlert = () => {
          setNumericError(null);
     };

     const [inputs, setInputs] = useState<InputItem[]>([{ order: '', score: '', definition: '' }]);

     const handleAddInput = () => {
          setInputs([...inputs, { order: '', score: '', definition: '' }]);
     };

     const handleInputChange = (index: number, fieldName: keyof InputItem, value: string) => {
          const newInputs = [...inputs];
          newInputs[index][fieldName] = value;
          setInputs(newInputs);
     };

     const handleRemoveInput = (index: number) => {
          const newInputs = [...inputs];
          newInputs.splice(index, 1);
          setInputs(newInputs);
     };

     const handleSwitchChange = (checked: boolean) => {
          setActive(checked);
     };



     // popup edit
     const questionLineChange = (value: any, record?: Question) => {
          if (record) {
               const newQuestion: Question = { ...record, questionLine: value };
               setQuestions(newQuestion);
          }
     };
     const questionTextChange = (value: string, record?: Question) => {
          if (record) {
               const newQuestion: Question = { ...record, questionText: value };
               setQuestions(newQuestion);
          }
     };
     const questionTypeChange = (value: string, record?: Question) => {
          if (record) {
               const newQuestion: Question = { ...record, questionType: value };
               setQuestions(newQuestion);
          }
     };
     const questionScoreChange = (value: string, record?: Question) => {
          if (record) {
               const newQuestion: Question = { ...record, score: value };
               setQuestions(newQuestion);
          }
     };

     const handleOptionChange = (index: number, value: string, record: Question) => {

          const newOptions = [...record.options];
          newOptions[index] = { ...newOptions[index], optionText: value };
          const updatedQuestion: Question = { ...record, options: newOptions };
          setQuestions(updatedQuestion);

     };

     // popup button
     const showModal = (record: Question) => {

          const newQuestion: Question = {
               questionID: record.questionID,
               questionLine: record.questionLine,
               questionType: record.questionType,
               questionText: record.questionText,
               score: record.score,
               key: 'sample_key',
               options: record.options
          };
          setPreviousQuestionLine(record.questionLine);
          setQuestions(newQuestion);
          setIsModalOpen(true);

     };
     const handleCancel = () => {
          setIsModalOpen(false);
     };
     const handleOk = async () => {
         
          if (editQuestions) {
               const newQuestion: Question = {
                    questionID: editQuestions.questionID,
                    questionLine: editQuestions.questionLine, // Sıra
                    questionType: editQuestions.questionType, // Soru Türü
                    questionText: editQuestions.questionText || "", // Soru
                    score: editQuestions.score || "", // Puan Ağırlık Çarpanı
                    key: "newKey", // Yeni soru için bir anahtar atanabilir
                    options: editQuestions.options
               };
               

               const isSet = data.filter(x => x.questionLine == editQuestions.questionLine);
               if (previousQuestionLine == editQuestions.questionLine || (isNumeric(editQuestions.questionLine) && isSet.length == 0)) {
                    try {
                         const response = await updateQuestionForQuestionSet(newQuestion, params.id);

                         if (response) {
                              console.log('Data updated successfully:', response);
                              setIsModalOpen(false);
                              setIsUpdatedQuestion(true);
                              fetchData();
                         } else {
                              console.error('Question update edilirken bir hata oluştu.');
                         }
                    } catch (error) {
                         console.error('Question update edilirken bir hata oluştu:', error);
                    }
               }
               else {
                    setNumericError(true);
                    setTimeout(() => {
                         setNumericError(false);
                    }, 3000);

               }

          }
     };

     return (
          <div className='container mt-5 mb-5'>
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
                         href="http://localhost:3000/question_set"
                    >
                         Geri
                    </Button>

                    <span style={{ marginLeft: 10, fontWeight: "bolder", fontSize: 15 }}>Soru Seti Detayı</span>


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
                         <ProjectTwoTone style={{ color: "#0d6efd", fontSize: '70px', marginRight: 30 }} />
                         <Form.Item style={{ width: 300, marginRight: 20, }}>
                              <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Tanıtıcı</label>
                              <Input style={{ border: "none", boxShadow: "0 0 0 0" }} readOnly value={questionSetID} placeholder="-" />
                         </Form.Item>
                         <Form.Item style={{ width: 150, marginRight: 20 }}>
                              <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Soru Seti Türü</label>
                              <Input style={{ border: "none", boxShadow: "0 0 0 0" }} onChange={handleQuestionTypeChange} readOnly value={questionSetType} placeholder="-" />
                         </Form.Item>
                         <Form.Item style={{ width: 150 }}>
                              <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Tanım</label>
                              <Input style={{ border: "none", boxShadow: "0 0 0 0" }} readOnly onChange={handleQuestionSetNameChange} value={questionSetName} placeholder="-" />
                         </Form.Item>

                    </div>
               </Form>
               {/* HEADER <--*/}
               {/* HEADER UPDATE MODAL <--*/}
               <Modal
                    width={300}
                    title="Soru Seti Düzenle "
                    open={isUpdateQuestionSet}
                    okType='default'
                    onOk={handleSaveButtonClick}
                    onCancel={handleSaveCancelClick}
                    okText='Kaydet'
                    cancelText='İptal'
                    afterClose={() => {
                    }}>
                    <Form
                         form={form}
                         style={{ marginTop: 15 }}>
                         <div className="row">
                              <div className="col-md-12">
                                   <Form.Item>
                                        <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Soru Seti Türü</label>
                                        <Input style={{ borderColor: '#0d6efd' }} onChange={handleQuestionTypeChange} readOnly={false} value={questionSetType} placeholder="-" />
                                   </Form.Item>
                              </div>
                         </div>

                         <div className="row">
                              <div className="col-md-12">
                                   <Form.Item>
                                        <label style={{ fontWeight: 'bold', marginLeft: 10 }}>Tanım</label>
                                        <Input style={{ borderColor: '#0d6efd' }} readOnly={false} onChange={handleQuestionSetNameChange} value={questionSetName} placeholder="-" />
                                   </Form.Item>
                              </div>
                         </div>
                    </Form>
               </Modal>
               {/* HEADER UPDATE MODAL <--*/}


               {/* TABLE -->*/}
               <Button
                    onClick={showNewQuestionModal}
                    type="default"
                    style={{
                         float: 'right',
                         marginBottom: 16,
                    }}
                    icon={<FileAddOutlined />}
               >
                    Yeni Soru Ekle
               </Button>
               <Modal
                    width={1000}
                    title="Soru Ekle"
                    open={isNewQuestionModalOpen}
                    okType='default'
                    onOk={newQuestionModalOk}
                    onCancel={newQuestionModelCancel}
                    okText='Kaydet'
                    cancelText='İptal'
                    afterClose={() => {
                         setNumericError(false);
                    }}>

                    {numericError && (
                         <Alert afterClose={closeNumericAlert} closable message="Sıra değeri için daha önce girilmeyen ve numeric bir değer giriniz." description={numericError} type="error" showIcon />
                    )}
                    <p style={{ fontSize: 15, fontWeight: "bolder" }} className='mt-5'>Soru Türü</p>
                    <Select
                         value={answerType}
                         onChange={(value) => handleAnswerTypeChange(value)}
                         style={{ width: 950 }}
                         options={options} />
                    <p style={{ fontSize: 15, fontWeight: "bolder" }} className='mt-2'>Sıra</p>
                    <Input
                         style={{ width: 950 }}
                         value={questionLine}
                         onChange={(e) => {
                              setNumericError(false);
                              setquestionLine(e.target.value);
                         }}
                    />
                    <p style={{ fontSize: 15, fontWeight: "bolder" }} className='mt-2'>Soru</p>
                    <Input
                         style={{ width: 950 }}
                         value={questionText}
                         onChange={(e) => {
                              setquestionText(e.target.value);
                         }}
                    />
                    <p style={{ fontSize: 15, fontWeight: "bolder" }} className='mt-2'>Puan Ağırlık Çarpanı</p>
                    <Input
                         style={{ width: 950 }}
                         value={score}
                         onChange={(e) => {
                              setScore(e.target.value);
                         }}
                    />
                    <p style={{ fontSize: 15, fontWeight: "bolder" }} className='mt-2'>Zorunlu mu?</p>
                    <Switch className='mb-2' checkedChildren="Açık" unCheckedChildren="Kapalı" defaultChecked onChange={handleSwitchChange} />

                    {answerType !== 'Free Text' && answerType !== '' && (
                         <>
                              <div className='mt-2' style={{ display: 'flex' }}>
                                   <p style={{ fontSize: 15, fontWeight: "bolder", marginRight: "74%" }}>Seçenekler</p>
                                   <Button icon={<FileAddOutlined />} style={{ color: "#0d6efd", fontSize: 15, border: "none", float: "right", marginBottom: 20 }} onClick={handleAddInput}>Yeni Seçenek Ekle</Button>
                              </div>
                              <div>

                              </div>
                              <div>
                                   {inputs.map((input, index) => (
                                        <div key={index} style={{ display: 'flex', marginBottom: 8 }}>
                                             <Space>
                                                  <Input
                                                       style={{ marginRight: 8, width: 100 }}
                                                       value={input.order}
                                                       onChange={(e) => handleInputChange(index, 'order', e.target.value)}
                                                       placeholder="Sıra"
                                                  />
                                                  <Input
                                                       style={{ marginRight: 8, width: 100 }}
                                                       value={input.score}
                                                       onChange={(e) => handleInputChange(index, 'score', e.target.value)}
                                                       placeholder="Puan"
                                                  />
                                                  <Input
                                                       style={{ marginRight: 8, width: 250 }}
                                                       value={input.definition}
                                                       onChange={(e) => handleInputChange(index, 'definition', e.target.value)}
                                                       placeholder="Tanım"
                                                  />
                                                  <Button onClick={() => handleRemoveInput(index)}>Sil</Button>
                                             </Space>
                                        </div>
                                   ))}
                              </div>
                         </>
                    )}



               </Modal>
               <Table columns={columns} dataSource={data} expandable={{ expandedRowRender: expandedRowRender }} />
               {/* TABLE <--*/}

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
                    }}>
                    {numericError && (
                         <Alert afterClose={closeNumericAlert} closable message="Sıra değeri için daha önce girilmeyen ve numeric bir değer giriniz." description={numericError} type="error" showIcon />
                    )}
                    <p style={{ fontWeight: 'bold' }} className='mt-2'>Tanıtıcı</p>
                    <Input
                         style={{ width: 200 }}
                         value={editQuestions?.questionID}
                         readOnly
                    />
                    <p style={{ fontWeight: 'bold' }} className='mt-2'>Sıra</p>
                    <Input
                         style={{ width: 200 }}
                         value={editQuestions?.questionLine}
                         onChange={(e) => {
                              setNumericError(false);
                              questionLineChange(e.target.value, editQuestions)
                         }

                         }
                    />
                    <p style={{ fontWeight: 'bold' }} className='mt-2'>Soru Türü</p>
                    <Input
                         style={{ width: 200 }}
                         value={editQuestions?.questionType}
                         onChange={(e) => questionTypeChange(e.target.value, editQuestions)}
                    />
                    <p style={{ fontWeight: 'bold' }} className='mt-2'>Soru</p>
                    <Input
                         style={{ width: 200 }}
                         value={editQuestions?.questionText}
                         onChange={(e) => questionTextChange(e.target.value, editQuestions)}
                    />
                    <p style={{ fontWeight: 'bold' }} className='mt-2'>Puan Ağırlık Değeri</p>
                    <Input
                         style={{ width: 200 }}
                         value={editQuestions?.score}
                         onChange={(e) => questionScoreChange(e.target.value, editQuestions)}
                    />

                    <p style={{ fontWeight: 'bold' }} className='mt-2'>Seçenekler</p>

                    {editQuestions?.options.map((option: any) => (

                         <Input
                              key={option.optionIndex}
                              value={option.optionText}
                              onChange={(e) => handleOptionChange(option.optionIndex, e.target.value, editQuestions)}
                              readOnly={false}
                              style={{ width: 100, marginRight: 10 }}
                         />
                    ))}
               </Modal>
               {/* EDIT POPUP <--*/}
          </div>
     );
}