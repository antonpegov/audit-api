import { IsNotEmpty, IsString, Validate } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { ProjectNameAvailable } from '@projects/validators/project-name-available'

export class CreateProjectRequest {
  @IsString()
  @IsNotEmpty()
  @Validate(ProjectNameAvailable)
  @ApiProperty({ example: 'My Project1' })
  name: string

  @IsNotEmpty()
  @ApiProperty({ example: 'Some Description' })
  description: string

  @IsNotEmpty()
  @ApiProperty({ example: 'https://my.github.com' })
  gitUrl: string

  @IsNotEmpty()
  @ApiProperty({ example: '{"Cats": "My cat`s photos", "Dog": "My dog`s photos"}' })
  gitFolders: Record<string, string>

  @IsNotEmpty()
  @ApiProperty({ example: '["bitcoin", "privacy"]' })
  tags: string[]
}

