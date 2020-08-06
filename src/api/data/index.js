import request from '@/utils/request'
import qs from 'qs';
//答题
export function split(data) {
    return request({
        url: '/column/split',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function merge(data) {
    return request({
        url: '/excelCalculation/mergeFields',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function replace(data) {
    return request({
        url: '/excelCalculation/substitution',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function extract(data) {
    return request({
        url: '/column/extract',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function charextract(data) {
    return request({
        url: '/column/charextract',
        method: 'post',
        data: qs.stringify(data)
    })
}