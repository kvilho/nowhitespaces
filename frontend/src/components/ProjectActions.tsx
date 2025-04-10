import React, { useState, useRef } from 'react';
import { 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    Box, 
    Alert, 
    Snackbar,
    Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import '../styles/projects.css';
import api from '../api/axios';

const ProjectActions: React.FC = () => {
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [projectCode, setProjectCode] = useState(['', '', '', '', '', '']);
    const [newProject, setNewProject] = useState({
        projectName: '',
        projectDescription: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const handleCreateProject = async () => {
        try {
            const response = await api.post('/api/projects/create', {
                projectName: newProject.projectName,
                projectDescription: newProject.projectDescription
            });
            console.log('Project created:', response.data);
            setIsCreateDialogOpen(false);
            setNewProject({ projectName: '', projectDescription: '' });
            setSnackbar({
                open: true,
                message: `Project created successfully! Project code: ${response.data.projectCode}`,
                severity: 'success'
            });
        } catch (error: any) {
            console.error('Error creating project:', error);
            setSnackbar({
                open: true,
                message: error.response?.data || 'Error creating project',
                severity: 'error'
            });
        }
    };

    const handleJoinProject = async () => {
        try {
            const code = projectCode.join('');
            await api.post(`/api/projects/join?projectCode=${code}`);
            setIsJoinDialogOpen(false);
            setProjectCode(['', '', '', '', '', '']);
            setSnackbar({
                open: true,
                message: 'Successfully joined the project!',
                severity: 'success'
            });
        } catch (error: any) {
            console.error('Error joining project:', error);
            setSnackbar({
                open: true,
                message: error.response?.data || 'Error joining project',
                severity: 'error'
            });
        }
    };

    const handleInputChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newProjectCode = [...projectCode];
        newProjectCode[index] = value;
        setProjectCode(newProjectCode);

        if (value !== '' && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Backspace' && projectCode[index] === '' && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <Stack spacing={2} direction="row">
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => setIsCreateDialogOpen(true)}
                    startIcon={<AddIcon />}
                    sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500
                    }}
                >
                    Create Project
                </Button>
                <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => setIsJoinDialogOpen(true)}
                    startIcon={<GroupAddIcon />}
                    sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500
                    }}
                >
                    Join Project
                </Button>
            </Stack>

            {/* Create Project Dialog */}
            <Dialog 
                open={isCreateDialogOpen} 
                onClose={() => setIsCreateDialogOpen(false)}
                PaperProps={{ 
                    style: { 
                        borderRadius: '12px',
                        minWidth: '400px'
                    } 
                }}
            >
                <DialogTitle 
                    className="dialog-title"
                    sx={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        fontSize: '1.25rem'
                    }}
                >
                    Create New Project
                </DialogTitle>
                <DialogContent className="dialog-content">
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Project Name"
                            type="text"
                            fullWidth
                            value={newProject.projectName}
                            onChange={(e) => setNewProject({...newProject, projectName: e.target.value})}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Project Description"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            value={newProject.projectDescription}
                            onChange={(e) => setNewProject({...newProject, projectDescription: e.target.value})}
                        />
                    </Box>
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button 
                        onClick={() => setIsCreateDialogOpen(false)}
                        sx={{ 
                            color: '#666',
                            textTransform: 'none'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleCreateProject}
                        variant="contained"
                        disabled={!newProject.projectName}
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: 2
                        }}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Join Project Dialog */}
            <Dialog 
                open={isJoinDialogOpen} 
                onClose={() => setIsJoinDialogOpen(false)}
                PaperProps={{ 
                    style: { 
                        borderRadius: '12px',
                        minWidth: '400px'
                    } 
                }}
            >
                <DialogTitle 
                    className="dialog-title"
                    sx={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        fontSize: '1.25rem'
                    }}
                >
                    Join Project
                </DialogTitle>
                <DialogContent className="dialog-content">
                    <Box sx={{ mt: 2 }}>
                        <div className="project-code-inputs">
                            {projectCode.map((digit, index) => (
                                <TextField
                                    key={index}
                                    inputRef={inputRefs[index]}
                                    className="project-code-input"
                                    value={digit}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    inputProps={{
                                        maxLength: 1,
                                        style: { 
                                            textAlign: 'center',
                                            fontSize: '1.5rem',
                                            fontWeight: '500'
                                        }
                                    }}
                                    variant="outlined"
                                />
                            ))}
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button 
                        onClick={() => setIsJoinDialogOpen(false)}
                        sx={{ 
                            color: '#666',
                            textTransform: 'none'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleJoinProject}
                        variant="contained"
                        disabled={projectCode.some(digit => digit === '')}
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: 2
                        }}
                    >
                        Join
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProjectActions; 