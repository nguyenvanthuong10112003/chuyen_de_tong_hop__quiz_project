import { Link, useNavigate } from "react-router-dom";
import { ROUTER_PAGE, DEFINE_DIFFICULTY, DEFINE_TYPE, CONTENT_TYPE } from "../../common/Const";
import { getsByTopic, lstSubject, remove } from "../../service/QuestionService";
import { useEffect, useState } from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from "react-toastify";

export const Question = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [expands, setExpands] = useState({});
    const [selecteds, setSelecteds] = useState({});
    useEffect(() => {
        lstSubject()
            .then(response => {
                setSubjects(response.data.data)
            })
            .catch(() => { })
    }, [])
    const toggleTopic = async (topic) => {
        const key = 'topic-' + topic.id;

        if (!topic.groups?.length && !expands[key]) {
            try {
                const res = await getsByTopic(topic.id)
                setSubjects(prev => {
                    const clone = [...prev];
                    const s = clone.find(s => s.topics.findIndex(t => t.id === topic.id) !== -1);
                    const t = s.topics.find(t => t.id === topic.id);

                    // Gán groups mới
                    t.groups = res.data.data;

                    // Cập nhật selected cho groups mới
                    setSelecteds(prevSelected => {
                        const updated = { ...prevSelected };

                        // Nếu topic đang được tick, tick tất cả group mới
                        const topicKey = `topic-${topic.id}`;
                        if (prevSelected[topicKey] === true) {
                            t.groups.forEach(group => {
                                const groupKey = `group-${group.id}`;
                                updated[groupKey] = true;
                                group.selected = true;
                            });
                        }

                        return updated;
                    });

                    return clone;
                })
            } catch {}
        };

        setExpands(prev => ({ ...prev, [key]: !prev[key] }));
    }
    const handleDelete = () => {
        confirmAlert({
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc muốn xóa không?',
            buttons: [
                {
                    label: 'Có',
                    onClick: () => {
                        console.log(selecteds)
                        let lst = [];
                        Object.keys(selecteds).forEach(key => {
                            if (!selecteds[key]) return;
                            const index = key.indexOf("-");
                            const type = key.substring(0, index);
                            const indexFind = lst.findIndex(item => item.type === type);
                            const id = key.substring(index + 1);
                            if (indexFind === -1)
                                lst = [...lst, { type: type.toUpperCase(), lstId: [id] }];
                            else
                                lst[indexFind] = { ...lst[indexFind], lstId: [...lst[indexFind].lstId, id] };
                        })
                        remove(lst)
                            .then(() => {
                                toast.success('Xóa thành công');
                                setSelecteds([])
                                setSubjects(prevSubjects =>
                                    prevSubjects
                                        .filter(subject => !subject.selected)        // lọc subject bỏ selected
                                        .map(subject => ({
                                            ...subject,
                                            topics: [...subject.topics ?? []]
                                                .filter(topic => !topic.selected)    // lọc topic bỏ selected
                                                .map(topic => ({
                                                    ...topic,
                                                    groups: [...topic.groups ?? []]
                                                        .filter(group => !group.selected)  // lọc group bỏ selected
                                                }))
                                        }))
                                );
                            })
                            .catch(() => { })
                    }
                },
                {
                    label: 'Không',
                    onClick: () => { } // hủy
                }
            ],
            overlayClassName: 'bg-white/20',
            className: 'custom-confirm-box'
        });
    };
    const handlerSelectTopic = (topic, subjectId) => {
        const updated = { ...selecteds };
        const key = `topic-${topic.id}`;
        const value = !updated[key]; // toggle
        const parent = subjects.find(s => s.id === subjectId);

        // Cập nhật topic
        updated[key] = value;
        topic.selected = value;

        // Cập nhật các group con
        topic.groups = topic.groups?.map(g => {
            updated[`group-${g.id}`] = value;
            g.selected = value;
            return g;
        });

        parent.topics = parent.topics.map(t => t.id === topic.id ? topic : t);

        // Nếu bỏ tick, bỏ tick cha
        if (!value && subjectId) {
            updated[`subject-${subjectId}`] = false;
            parent.selected = false;
        } else if (value && subjectId) {
            // Nếu tick, check cha chỉ khi tất cả topic con được tick
            if (parent && allTopicsSelected(parent, updated)) {
                updated[`subject-${subjectId}`] = true;
                parent.selected = true;
            }
        }

        setSelecteds(updated);
        setSubjects([...subjects].map(s => s.id === parent.id ? parent : s));
    };
    const handlerSelectGroup = (group, topicId, subjectId) => {
        const updated = { ...selecteds };
        const key = `group-${group.id}`;
        const value = !updated[key]; // toggle
        const topic = subjects
            .flatMap(s => s.topics)
            .find(t => t.id === topicId);
        const subject = subjects.find(s => s.id === subjectId);
        // Cập nhật group
        updated[key] = value;
        group.selected = value;

        // Nếu bỏ tick, bỏ tick topic cha
        if (!value && topicId) {
            updated[`topic-${topicId}`] = false;
            updated[`subject-${subjectId}`] = false;
            topic.selected = false;
            subject.selected = false;
        } else if (value && topicId) {
            // Nếu tick, check topic cha chỉ khi tất cả group con được tick
            if (topic && topic.groups.every(g => updated[`group-${g.id}`])) {
                updated[`topic-${topicId}`] = true;
                topic.selected = true;
            }

            // Check subject cha nếu tất cả topic được tick
            if (subject && allTopicsSelected(subject, updated)) {
                updated[`subject-${subjectId}`] = true;
                subject.selected = true;
            }
        }

        topic.groups = topic.groups.map(g => g.id === group.id ? group : g);
        subject.topics = subject.topics.map(t => t.id === topic.id ? topic : t);

        setSelecteds(updated);
        setSubjects([...subjects].map(s => s.id === subject.id ? subject : s))
    };
    const handlerSelectSubject = (subject) => {
        const cloneSelecteds = { ...selecteds };
        const key = `subject-${subject.id}`;
        const value = !cloneSelecteds[key]; // toggle

        subject.selected = value;
        cloneSelecteds[key] = value;

        // Lan xuống topic và group
        subject.topics = subject.topics?.map(topic => {
            cloneSelecteds[`topic-${topic.id}`] = value;
            topic.selected = value;
            topic.groups = topic.groups?.map(group => {
                cloneSelecteds[`group-${group.id}`] = value;
                group.selected = value;
                return group;
            });
            return topic;
        });

        setSelecteds(cloneSelecteds);
        setSubjects([...subjects].map(s => s.id === subject.id ? subject : s));
    };
    const expandQuestion = (question) => {
        return <div className="ps-10 cursor-default bg-white">
            <div className="flex flex-row flex-wrap">
                {question.contents.map((item, index) => {
                    return item.type === CONTENT_TYPE.TEXT ?
                        <p className="w-full" key={index}>{(index === 0 ? 'Câu hỏi: ' : '') + item.content}</p> :
                        <img src={item.photo} key={index} alt="" className="w-60 text-center m-1" />
                })}
            </div>
            <div className="flex flex-col">
                {question.answers.map((item, index) => {
                    return <span key={index}><span className={item.isCorrect === true ? 'underline' : ''}>{String.fromCharCode(65 + index)}.</span> {item?.contents[0].content ?? ''}</span>
                })}
            </div>
        </div>
    }
    const keyOf = (type, id) => `${type}-${id}`;
    const isExpand = (expands, key) => expands[key] === true;
    const ExpandRow = ({ onClick, expanded, title, children, checkbox, editIcon, className }) => (
        <span
            onClick={onClick}
            className={`p-1 border-b flex flex-row items-center border-gray-200 hover:bg-purple-200 ${className}`}
            title={title}
        >
            <span className={`material-icons me-2 ${expanded ? "-rotate-90" : "rotate-180"}`}>navigate_before</span>
            <span className="w-full max-w-full text-nowrap text-ellipsis overflow-hidden">{children}</span>
            {editIcon}
            {checkbox}
        </span>
    );
    const Checkbox = ({ checked, onChange }) => { 
        return <input
            type="checkbox"
            className="me-1"
            checked={!!checked}
            onClick={(e) => e.stopPropagation()}
            onChange={onChange}
        />
    };
    const SubjectItem = ({ subject, expands, selecteds, toggleExpand, handlerSelectSubject, renderTopics }) => {
        const sKey = keyOf("subject", subject.id);
        return (
            <div key={subject.id} className="text-lg font-semibold flex flex-col cursor-pointer">
                <ExpandRow
                    onClick={() => toggleExpand(sKey)}
                    expanded={isExpand(expands, sKey)}
                    title={subject.name}
                    checkbox={
                        <Checkbox
                            checked={subject.selected}
                            onChange={handlerSelectSubject}
                        />
                    }
                >
                    Môn học: {subject.name}
                </ExpandRow>

                {isExpand(expands, sKey) && (
                    <div className="ps-2 flex flex-col">
                        {renderTopics(subject)}
                    </div>
                )}
            </div>
        );
    };
    const TopicItem = ({ topic, expands, selecteds, toggleExpand, handlerSelectTopic, renderGroups }) => {
        const tKey = keyOf("topic", topic.id);
        return (
            <div key={topic.id} className="!text-base !font-medium flex flex-col">
                <ExpandRow
                    onClick={() => toggleExpand(tKey)}
                    expanded={isExpand(expands, tKey)}
                    title={topic.name}
                    checkbox={
                        <Checkbox
                            checked={topic.selected}
                            onChange={handlerSelectTopic}
                        />
                    }
                >
                    Chủ đề: {topic.name}
                </ExpandRow>

                {isExpand(expands, tKey) && (
                    <div className="w-full ps-2">{renderGroups(topic)}</div>
                )}
            </div>
        );
    };
    const GroupItem = ({ group, expands, toggleExpand, renderQuestions, expandQuestion, handlerSelectGroup }) => {
        const gKey = keyOf("group", group.id);

        const title =
            group.type === DEFINE_TYPE.ONLY
                ? group.questions[0].contents[0].content
                : group.contents[0]?.content;

        return (
            <div key={group.id} className="text-sm">
                <ExpandRow
                    onClick={() => toggleExpand(gKey)}
                    expanded={isExpand(expands, gKey)}
                    title={title}
                    checkbox={
                        <Checkbox
                            checked={group.selected}
                            onChange={() => handlerSelectGroup(gKey)}
                        />
                    }
                    editIcon={
                        <Link to={`${ROUTER_PAGE.QUESTION.EDIT}?id=${group.id}`} className="material-icons me-2 text-blue-600 hover:text-blue-700"
                            onClick={(e) => { e.stopPropagation(); }}>
                            mode_edit
                        </Link>
                    }
                >
                    {group.type === DEFINE_TYPE.ONLY
                        ? "Câu hỏi: " + group.questions[0].contents[0].content
                        : "Nhóm câu hỏi" + (title ? ": " + title : "")}
                </ExpandRow>

                {isExpand(expands, gKey) && (
                    <div className="w-full ps-2">
                        {group.type === DEFINE_TYPE.ONLY
                            ? expandQuestion(group.questions[0])
                            : renderQuestions(group)}
                    </div>
                )}
            </div>
        );
    };
    const QuestionItem = ({ question, expands, toggleExpand, expandQuestion }) => {
        const qKey = keyOf("question", question.id);

        return (
            <div key={question.id}>
                <ExpandRow
                    onClick={() => toggleExpand(qKey)}
                    expanded={isExpand(expands, qKey)}
                >
                    Câu hỏi: {question.contents[0].content}
                </ExpandRow>

                {isExpand(expands, qKey) && expandQuestion(question)}
            </div>
        );
    };
    // Kiểm tra xem tất cả con của một topic đã được chọn chưa
    const allGroupsSelected = (topic, selecteds) =>
        topic.groups?.every(g => selecteds[`group-${g.id}`]) ?? true;

    // Kiểm tra tất cả topic của subject đã được chọn chưa
    const allTopicsSelected = (subject, selecteds) =>
        subject.topics?.every(t => allGroupsSelected(t, selecteds) && selecteds[`topic-${t.id}`]) ?? true;
    const disabledBtnDel = () => {
        return !Object.values(selecteds).some(v => v === true);
    }
    document.title = "Ngân hàng câu hỏi";
    return (
        <div className="space-y-4">
            <div className="bg-gray-50 border-2 border-gray-100 rounded-sm shadow-xs p-2">
                <h2 className="font-semibold text-xl">Ngân hàng câu hỏi</h2>

                {/* Buttons */}
                <div className="space-y-2 mt-2 flex flex-row items-baseline space-x-2">
                    <button
                        className="bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 font-semibold flex flex-row"
                        onClick={() => navigate(ROUTER_PAGE.QUESTION.ADD)}
                    >
                        <span className="material-icons me-2">add</span> Thêm mới
                    </button>

                    <button
                        disabled={disabledBtnDel()}
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-2 py-2 rounded font-semibold flex flex-row disabled:opacity-40"
                    >
                        <span className="material-icons me-2">close</span> Xóa
                    </button>
                </div>

                {/* SUBJECT LIST */}
                <div className="border-t border-gray-200 mt-2 p-2 pb-0">
                    {!subjects?.length && <p className="text-gray-600">Chưa có câu hỏi nào</p>}

                    {subjects?.map((subject) => (
                        <SubjectItem
                            key={subject.id}
                            subject={subject}
                            expands={expands}
                            selecteds={selecteds}
                            toggleExpand={(key) =>
                                setExpands((prev) => ({ ...prev, [key]: !prev[key] }))
                            }
                            handlerSelectSubject={() => handlerSelectSubject(subject)}
                            renderTopics={(subject) =>
                                subject.topics.map((topic) => (
                                    <TopicItem
                                        key={topic.id}
                                        topic={topic}
                                        expands={expands}
                                        selecteds={selecteds}
                                        toggleExpand={() => { toggleTopic(topic) }}
                                        handlerSelectTopic={() => handlerSelectTopic(topic, subject.id)}
                                        renderGroups={(topic) =>
                                            topic.groups?.map((group) => (
                                                <GroupItem
                                                    key={group.id}
                                                    group={group}
                                                    expands={expands}
                                                    toggleExpand={(key) =>
                                                        setExpands((prev) => ({
                                                            ...prev,
                                                            [key]: !prev[key],
                                                        }))
                                                    }
                                                    handlerSelectGroup={() => handlerSelectGroup(group, topic.id, subject.id)}
                                                    expandQuestion={expandQuestion}
                                                    renderQuestions={(group) =>
                                                        group.questions.map((q) => (
                                                            <QuestionItem
                                                                key={q.id}
                                                                question={q}
                                                                expands={expands}
                                                                toggleExpand={(key) =>
                                                                    setExpands((prev) => ({
                                                                        ...prev,
                                                                        [key]: !prev[key],
                                                                    }))
                                                                }
                                                                expandQuestion={expandQuestion}
                                                            />
                                                        ))
                                                    }
                                                />
                                            ))
                                        }
                                    />
                                ))
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}