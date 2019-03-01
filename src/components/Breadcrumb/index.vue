<template>
<el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
            <span v-if="item.redirect==='noredirect' || index==levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
            <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
        </el-breadcrumb-item>
    </transition-group>
</el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
    data() {
        return {
            levelList: null
        }
    },
    watch: {
        $route() {
            this.getBreadcrumb()
        }
    },
    created() {
        this.getBreadcrumb()
    },
    methods: {
        getBreadcrumb() {
            let matched = this.$route.matched.filter(item => item.name)
            const first = matched[0];
            if (first && first.name !== 'dashboard') {
                matched = [{path: '/dashboard', meta: {title: 'Dashboard'}}].concat(matched)
            }
            this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
        },
        pathCompile(path) {
            const { params } = this.$route
            /**
             * 快速填充 url 字符串的参数值。
             * var url = '/user/:id/:name'
             * var data = {id: 10001, name: 'bob'}
             * console.log(pathToRegexp.compile(url)(data))
             * 打印结果：/user/10001/bob
            */
            let toPath = pathToRegexp.compile(path)
            return toPath(params)
        },
        handleLink(item) {
            const {redirect, path} = item
            if (redirect) {
                this.$router.push(redirect)
                return
            }
            this.$router.push(this.pathCompile(path))
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .app-breadcrumb.el-breadcrumb {
        display: inline-block;
        font-size: 14px;
        line-height: 50px;
        margin-left: 10px;
        .no-redirect {
            color: #97a8be;
            cursor: text;
        }
    }
</style>
