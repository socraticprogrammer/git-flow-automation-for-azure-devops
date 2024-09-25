import { $ } from 'zx'
import { argv } from 'node:process'

const [, , ...flagsFromProcess] = argv

const BRANCH_NAME_FLAG_PROPERTY = 'branchName'

type Flags = Record<string, string | string[]>

const captureFlagsFromProcess: (flags: string[]) => Flags = (
  flags: string[]
): Flags => {
  const flagsInObjectFormat: Record<string, string | string[]> = {}
  flags.forEach((flag, index) => {
    const flagTrim = flag.trim()

    if (!index) {
      flagsInObjectFormat[BRANCH_NAME_FLAG_PROPERTY] = flagTrim
      return
    }

    if (flagTrim.includes('--')) {
      const flagWithoutHyphen = flagTrim.replaceAll('--', '')

      const formatStringWithHyphenToCamelCase = (value: string) => {
        if (!value.includes('-')) return value
        const stringSplittedByHyphen = value.split('-')
        const newStringWithFirstLetterUpperCase = stringSplittedByHyphen.map(
          (value, index) =>
            !index
              ? value
              : `${value.charAt(0).toUpperCase()}${value.slice(1, value.length)}`
        )
        return newStringWithFirstLetterUpperCase.join('')
      }

      flagsInObjectFormat[
        formatStringWithHyphenToCamelCase(flagWithoutHyphen)
      ] = ''
      return
    }

    const keysOfFlag = Object.keys(flagsInObjectFormat)
    const lastFlag = keysOfFlag[keysOfFlag.length - 1]
    if (flagsInObjectFormat[lastFlag]) {
      const value = flagsInObjectFormat[lastFlag]
      if (typeof value === 'string') {
        flagsInObjectFormat[lastFlag] = [value, flagTrim]
      } else {
        flagsInObjectFormat[lastFlag] = [...value, flagTrim]
      }
      return
    }

    flagsInObjectFormat[lastFlag] = flagTrim
  })

  return flagsInObjectFormat
}

const flags = captureFlagsFromProcess(flagsFromProcess)

console.table(flags)

interface Branch {
  name: string
  type: string
}

const BASE_BRANCH = 'develop'

const createAndCheckoutToShortLivedBranch: (
  branch: Branch
) => Promise<void> = async ({ type, name }: Branch): Promise<void> => {
  const shortLivedBranch = `${type}/${name}`
  const branches = (await $`git branch`).stdout

  const getCurrentBranch = (branches: string): string => {
    const branchesSplitted = branches.split('\n')
    return (
      branchesSplitted
        .find((branch) => branch.includes('*'))
        ?.replace('*', '')
        .trim() ?? ''
    )
  }

  const isShortLivedBranchExists: (branches: string) => boolean = (
    branches: string
  ) => branches.includes(shortLivedBranch)

  const currentBranch = getCurrentBranch(branches)

  if (currentBranch !== BASE_BRANCH) {
    await $`git checkout ${BASE_BRANCH}`
  }

  await $`git checkout ${!isShortLivedBranchExists(branches) ? '-b' : ''} ${shortLivedBranch}`
}

createAndCheckoutToShortLivedBranch({
  name: (flags?.branchName as string) || '',
  type: (flags?.branchType as string) || '',
})
