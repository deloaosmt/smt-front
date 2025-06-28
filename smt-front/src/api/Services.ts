import type { Project } from "../types/project"
import type { Revision } from "../types/revision"
import type { Subproject } from "../types/subpoject"
import type { File } from "../types/file"
import { mockProjects } from "../data/mockProjects"
import { mockSubprojects } from "../data/mockSubprojects"
import { mockRevisions } from "../data/mockRevisions"
import { mockFiles } from "../data/mockFiles"

interface CrudService<T> {
    getItems(): Promise<T[]>
    getItem(id: string): Promise<T>
    updateItem(item: T): Promise<T>
    deleteItem(id: string): Promise<void>
}

interface ProjectService extends CrudService<Project> {
    createItem(item: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project>
}

interface SubprojectService extends CrudService<Subproject> {
    createItem(item: Omit<Subproject, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subproject>
}

interface RevisionService extends CrudService<Revision> {
    createItem(item: Omit<Revision, 'id' | 'createdAt'>): Promise<Revision>
}

interface FileService extends CrudService<File> {
    createItem(item: Omit<File, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>): Promise<File>
}

// In-memory data stores (initialized with mock data)
let projectsData: Project[] = [...mockProjects]
let subprojectsData: Subproject[] = [...mockSubprojects]
let revisionsData: Revision[] = [...mockRevisions]
let filesData: File[] = [...mockFiles]

// Helper function to generate unique IDs
const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Helper function to generate unique numeric IDs
const generateNumericId = (): number => {
    return Date.now() + Math.floor(Math.random() * 1000)
}

// Mock Project Service Implementation
class MockProjectService implements ProjectService {
    async getItems(): Promise<Project[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100))
        return [...projectsData]
    }

    async getItem(id: string): Promise<Project> {
        await new Promise(resolve => setTimeout(resolve, 100))
        const project = projectsData.find(p => p.id === id)
        if (!project) {
            throw new Error(`Project with id ${id} not found`)
        }
        return project
    }

    async createItem(item: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
        await new Promise(resolve => setTimeout(resolve, 200))
        const now = new Date().toISOString().split('T')[0]
        const newProject: Project = {
            ...item,
            id: generateId(),
            createdAt: now,
            updatedAt: now
        }
        projectsData.push(newProject)
        return newProject
    }

    async updateItem(item: Project): Promise<Project> {
        await new Promise(resolve => setTimeout(resolve, 200))
        const index = projectsData.findIndex(p => p.id === item.id)
        if (index === -1) {
            throw new Error(`Project with id ${item.id} not found`)
        }
        const updatedProject: Project = {
            ...item,
            updatedAt: new Date().toISOString().split('T')[0]
        }
        projectsData[index] = updatedProject
        return updatedProject
    }

    async deleteItem(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200))
        const index = projectsData.findIndex(p => p.id === id)
        if (index === -1) {
            throw new Error(`Project with id ${id} not found`)
        }
        projectsData.splice(index, 1)
        
        // Also delete related subprojects, revisions, and files
        subprojectsData = subprojectsData.filter(sp => sp.projectId !== id)
        revisionsData = revisionsData.filter(r => r.projectId.toString() !== id)
        filesData = filesData.filter(f => f.projectId !== id)
    }
}

// Mock Subproject Service Implementation
class MockSubprojectService implements SubprojectService {
    async getItems(): Promise<Subproject[]> {
        await new Promise(resolve => setTimeout(resolve, 100))
        return [...subprojectsData]
    }

    async getItem(id: string): Promise<Subproject> {
        await new Promise(resolve => setTimeout(resolve, 100))
        const subproject = subprojectsData.find(sp => sp.id === id)
        if (!subproject) {
            throw new Error(`Subproject with id ${id} not found`)
        }
        return subproject
    }

    async createItem(item: Omit<Subproject, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subproject> {
        await new Promise(resolve => setTimeout(resolve, 200))
        const now = new Date().toISOString().split('T')[0]
        const newSubproject: Subproject = {
            ...item,
            id: generateId(),
            createdAt: now,
            updatedAt: now
        }
        subprojectsData.push(newSubproject)
        return newSubproject
    }

    async updateItem(item: Subproject): Promise<Subproject> {
        await new Promise(resolve => setTimeout(resolve, 200))
        const index = subprojectsData.findIndex(sp => sp.id === item.id)
        if (index === -1) {
            throw new Error(`Subproject with id ${item.id} not found`)
        }
        const updatedSubproject: Subproject = {
            ...item,
            updatedAt: new Date().toISOString().split('T')[0]
        }
        subprojectsData[index] = updatedSubproject
        return updatedSubproject
    }

    async deleteItem(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200))
        const index = subprojectsData.findIndex(sp => sp.id === id)
        if (index === -1) {
            throw new Error(`Subproject with id ${id} not found`)
        }
        subprojectsData.splice(index, 1)
        
        // Also delete related revisions and files
        revisionsData = revisionsData.filter(r => r.subprojectId !== id)
        filesData = filesData.filter(f => f.subprojectId !== id)
    }
}

// Mock Revision Service Implementation
class MockRevisionService implements RevisionService {
    async getItems(): Promise<Revision[]> {
        await new Promise(resolve => setTimeout(resolve, 100))
        return [...revisionsData]
    }

    async getItem(id: string): Promise<Revision> {
        await new Promise(resolve => setTimeout(resolve, 100))
        const revision = revisionsData.find(r => r.id.toString() === id)
        if (!revision) {
            throw new Error(`Revision with id ${id} not found`)
        }
        return revision
    }

    async createItem(item: Omit<Revision, 'id' | 'createdAt'>): Promise<Revision> {
        await new Promise(resolve => setTimeout(resolve, 200))
        const newRevision: Revision = {
            ...item,
            id: generateNumericId(),
            createdAt: new Date().toISOString()
        }
        revisionsData.push(newRevision)
        return newRevision
    }

    async updateItem(item: Revision): Promise<Revision> {
        await new Promise(resolve => setTimeout(resolve, 200))
        const index = revisionsData.findIndex(r => r.id === item.id)
        if (index === -1) {
            throw new Error(`Revision with id ${item.id} not found`)
        }
        revisionsData[index] = item
        return item
    }

    async deleteItem(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200))
        const index = revisionsData.findIndex(r => r.id.toString() === id)
        if (index === -1) {
            throw new Error(`Revision with id ${id} not found`)
        }
        revisionsData.splice(index, 1)
        
        // Also delete related files
        filesData = filesData.filter(f => f.revisionId?.toString() !== id)
    }
}

// Mock File Service Implementation
class MockFileService implements FileService {
    async getItems(): Promise<File[]> {
        await new Promise(resolve => setTimeout(resolve, 100))
        return [...filesData]
    }

    async getItem(id: string): Promise<File> {
        await new Promise(resolve => setTimeout(resolve, 100))
        const file = filesData.find(f => f.id.toString() === id)
        if (!file) {
            throw new Error(`File with id ${id} not found`)
        }
        return file
    }

    async createItem(item: Omit<File, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>): Promise<File> {
        await new Promise(resolve => setTimeout(resolve, 200))
        const now = new Date().toISOString()
        const newFile: File = {
            ...item,
            id: generateNumericId(),
            uuid: `550e8400-e29b-41d4-a716-${Math.random().toString(36).substr(2, 12)}`,
            createdAt: now,
            updatedAt: now
        }
        filesData.push(newFile)
        return newFile
    }

    async updateItem(item: File): Promise<File> {
        await new Promise(resolve => setTimeout(resolve, 200))
        const index = filesData.findIndex(f => f.id === item.id)
        if (index === -1) {
            throw new Error(`File with id ${item.id} not found`)
        }
        const updatedFile: File = {
            ...item,
            updatedAt: new Date().toISOString()
        }
        filesData[index] = updatedFile
        return updatedFile
    }

    async deleteItem(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200))
        const index = filesData.findIndex(f => f.id.toString() === id)
        if (index === -1) {
            throw new Error(`File with id ${id} not found`)
        }
        filesData.splice(index, 1)
    }
}

// Service instances
export const projectService: ProjectService = new MockProjectService()
export const subprojectService: SubprojectService = new MockSubprojectService()
export const revisionService: RevisionService = new MockRevisionService()
export const fileService: FileService = new MockFileService()

// Additional utility functions for data management
export const resetMockData = () => {
    projectsData = [...mockProjects]
    subprojectsData = [...mockSubprojects]
    revisionsData = [...mockRevisions]
    filesData = [...mockFiles]
}

export const getMockDataStats = () => {
    return {
        projects: projectsData.length,
        subprojects: subprojectsData.length,
        revisions: revisionsData.length,
        files: filesData.length
    }
}
