import { Injectable } from '@nestjs/common'

import { Project } from '@projects/schemas/project.schema'
import { CreateProject } from '@projects/dto/create-project.dto'
import { ProjectsRepository } from '@projects/projects.repository'

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  createProject(request: CreateProject): Promise<Omit<Project, 'password'>> {
    return this.projectsRepository.create(request).then((project) => {
      delete project.password

      return project
    })
  }

  getProjects(): Promise<Project[]> {
    return this.projectsRepository.find({}).then((projects) => {
      projects.forEach((project) => delete project.password)

      return projects
    })
  }
}

