import { cleanupRegistry } from "./registry";

/**
 * 自动清理装饰器 - 用于类方法
 * 当组件卸载时自动调用被装饰的方法执行清理
 */
export function AutoCleanup(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const cleanupFn = originalMethod.apply(this, args);

        // 注册清理函数
        cleanupRegistry.register(cleanupFn);


        return cleanupFn;
    };
}