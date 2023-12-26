import { Avatar } from 'antd';

export default () => {
    return (
        <div>
            <section className="bg-white dark:bg-slate-900">
                <div className="container px-5 py-4 mx-auto flex flex-wrap">
                    <div className="flex mt-auto mb-auto lg:w-3/5 sm:w-2/3 content-start sm:pr-10">
                        <div className="mt-6">
                            <Avatar
                                size="large"
                                src="https://water-drop-resources.oss-cn-chengdu.aliyuncs.com/images/rc-upload-1694484623067-25.jpg"
                            />
                        </div>
                        <div className="w-full sm:p-4 px-4 mb-6">
                            <h1 className="title-font font-medium text-xl mb-2 text-gray-900 dark:text-[var(--color-text)]">
                                Good morning, 超级管理员, Have a coffee break ☕
                            </h1>
                            <div className="leading-relaxed">上次登录时间： 第一次登录系统</div>
                        </div>
                    </div>
                    <div className="flex mb-auto lg:w-2/5 sm:w-2/3 content-start">
                        <div className="p-4 sm:w-1/2 lg:w-1/3 w-1/2">
                            <h2 className="title-font font-medium text-3xl text-gray-900 dark:text-[var(--color-text)]">
                                1
                            </h2>
                            <p className="leading-relaxed">今日 IP</p>
                        </div>
                        <div className="p-4 sm:w-1/2 lg:w-1/3 w-1/2">
                            <h2 className="title-font font-medium text-3xl text-gray-900 dark:text-[var(--color-text)]">
                                3
                            </h2>
                            <p className="leading-relaxed">今日访问</p>
                        </div>
                        <div className="p-4 sm:w-1/2 lg:w-1/3 w-1/2">
                            <h2 className="title-font font-medium text-3xl text-gray-900 dark:text-[var(--color-text)]">
                                10,212
                            </h2>
                            <p className="leading-relaxed">总访问量</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
