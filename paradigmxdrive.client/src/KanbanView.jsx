import { useState, useEffect } from 'react';
import { authFetch } from './AuthWrapper.jsx';
import './style/App.css';
import './style/inputStyle.css';

function TaskCard({ task, onEdit, onDelete, onMove }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div
            style={{
                backgroundColor: 'rgb(240,240,240)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '10px',
                border: '1px solid rgb(200,200,200)',
                position: 'relative',
                cursor: 'pointer'
            }}
            onClick={() => onEdit(task)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'rgb(30,30,30)' }}>
                    {task.title}
                </h4>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(!isMenuOpen);
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '0 4px'
                    }}
                >
                    ⋮
                </button>
            </div>

            {task.description && (
                <p style={{
                    margin: '0 0 8px 0',
                    fontSize: '12px',
                    color: 'rgb(80,80,80)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                }}>
                    {task.description}
                </p>
            )}

            {task.priority && (
                <span style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: task.priority === 'high' ? '#ffebee' :
                        task.priority === 'medium' ? '#fff3e0' : '#e8f5e9',
                    color: task.priority === 'high' ? '#c62828' :
                        task.priority === 'medium' ? '#ef6c00' : '#2e7d32'
                }}>
                    {task.priority}
                </span>
            )}

            {isMenuOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '35px',
                        right: '10px',
                        backgroundColor: 'white',
                        border: '1px solid rgb(200,200,200)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 100,
                        minWidth: '120px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task);
                            setIsMenuOpen(false);
                        }}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '13px'
                        }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                            setIsMenuOpen(false);
                        }}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '13px',
                            color: '#c62828'
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

function TaskModal({ task, onClose, onSave, columnId }) {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [priority, setPriority] = useState(task?.priority || 'medium');

    const handleSubmit = () => {
        if (!title.trim()) return;

        onSave({
            id: task?.id || Date.now().toString(),
            title,
            description,
            priority,
            columnId: task?.columnId || columnId
        });
    };

    return (
        <>
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    zIndex: 1003
                }}
            />

            <div
                style={{
                    position: 'fixed',
                    top: '25vh',
                    left: '35vw',
                    width: '30vw',
                    backgroundColor: 'rgb(30,30,30)',
                    zIndex: 1004,
                    borderRadius: '16px',
                    padding: '20px',
                    color: 'white'
                }}
            >
                <h3 style={{ marginTop: 0 }}>{task ? 'Edit Task' : 'New Task'}</h3>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: 'calc(100% - 20px)',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid rgb(60,60,60)',
                            backgroundColor: 'rgb(45,45,45)',
                            color: 'white',
                            fontSize: '14px'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            width: 'calc(100% - 20px)',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid rgb(60,60,60)',
                            backgroundColor: 'rgb(45,45,45)',
                            color: 'white',
                            fontSize: '14px',
                            minHeight: '80px',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                        Priority
                    </label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid rgb(60,60,60)',
                            backgroundColor: 'rgb(45,45,45)',
                            color: 'white',
                            fontSize: '14px'
                        }}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className="Cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="Save-btn" onClick={handleSubmit}>
                        Save
                    </button>
                </div>
            </div>
        </>
    );
}

function KanbanColumn({ column, tasks, onAddTask, onEditTask, onDeleteTask, onDropTask }) {
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = () => {
        setIsDraggingOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);

        const taskId = e.dataTransfer.getData('taskId');
        onDropTask(taskId, column.id);
    };

    return (
        <div
            style={{
                backgroundColor: isDraggingOver ? 'rgb(220,220,220)' : 'whitesmoke',
                borderRadius: '12px',
                padding: '15px',
                minWidth: '280px',
                maxWidth: '280px',
                height: 'calc(90vh - 120px)',
                display: 'flex',
                flexDirection: 'column'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'rgb(30,30,30)' }}>
                    {column.name}
                </h3>
                <button
                    onClick={() => onAddTask(column.id)}
                    style={{
                        background: 'rgb(30,30,30)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    +
                </button>
            </div>

            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    scrollbarWidth: 'thin'
                }}
            >
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('taskId', task.id);
                        }}
                    >
                        <TaskCard
                            task={task}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function KanbanView() {
    const [columns, setColumns] = useState([
        { id: 'todo', name: 'To Do' },
        { id: 'inprogress', name: 'In Progress' },
        { id: 'done', name: 'Done' }
    ]);

    const [tasks, setTasks] = useState([]);
    const [modalState, setModalState] = useState({ isOpen: false, task: null, columnId: null });

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const result = await window.storage.get('kanban-tasks');
            if (result?.value) {
                setTasks(JSON.parse(result.value));
            }
        } catch (error) {
            console.log('No saved tasks found');
        }
    };

    const saveTasks = async (newTasks) => {
        try {
            await window.storage.set('kanban-tasks', JSON.stringify(newTasks));
            setTasks(newTasks);
        } catch (error) {
            console.error('Failed to save tasks:', error);
        }
    };

    const handleAddTask = (columnId) => {
        setModalState({ isOpen: true, task: null, columnId });
    };

    const handleEditTask = (task) => {
        setModalState({ isOpen: true, task, columnId: task.columnId });
    };

    const handleSaveTask = (taskData) => {
        let newTasks;

        if (modalState.task) {
            newTasks = tasks.map(t => t.id === taskData.id ? taskData : t);
        } else {
            newTasks = [...tasks, taskData];
        }

        saveTasks(newTasks);
        setModalState({ isOpen: false, task: null, columnId: null });
    };

    const handleDeleteTask = (taskId) => {
        const newTasks = tasks.filter(t => t.id !== taskId);
        saveTasks(newTasks);
    };

    const handleDropTask = (taskId, newColumnId) => {
        const newTasks = tasks.map(t =>
            t.id === taskId ? { ...t, columnId: newColumnId } : t
        );
        saveTasks(newTasks);
    };

    return (
        <div>
            <h1>Kanban Board</h1>
            <p style={{ color: 'RGB(30,30,30)', marginBottom: '20px' }}>
                Organize your tasks
            </p>

            <div
                style={{
                    display: 'flex',
                    gap: '20px',
                    overflowX: 'auto',
                    paddingBottom: '20px'
                }}
            >
                {columns.map((column) => (
                    <KanbanColumn
                        key={column.id}
                        column={column}
                        tasks={tasks.filter(t => t.columnId === column.id)}
                        onAddTask={handleAddTask}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        onDropTask={handleDropTask}
                    />
                ))}
            </div>

            {modalState.isOpen && (
                <TaskModal
                    task={modalState.task}
                    columnId={modalState.columnId}
                    onClose={() => setModalState({ isOpen: false, task: null, columnId: null })}
                    onSave={handleSaveTask}
                />
            )}
        </div>
    );
}

export default KanbanView;