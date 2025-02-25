import cbs from './cbs'
import centers from './centers'
import dts from './dts'
import edges from './edges'
import guards from './guards'
import ks from './ks'
import lbers from './lbers'
import ls from './ls'
import ots from './ots'
import ps from './ps'
import qbs from './qbs'
import rbs from './rbs'
import safs from './safs'
import tes from './tes'
import wrs from './wrs'

const allPlayers = [
    ...cbs,
    ...centers,
    ...dts,
    ...edges,
    ...guards,
    ...ks,
    ...lbers,
    ...ls,
    ...ots,
    ...ps,
    ...qbs,
    ...rbs,
    ...safs,
    ...tes,
    ...wrs,
]

const rankedPlayers = allPlayers.sort((a, b) => b.rating - a.rating)

export default rankedPlayers

