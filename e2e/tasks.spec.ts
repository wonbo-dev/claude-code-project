import {test, expect} from '@playwright/test';

test.describe('Task CRUD', () => {
    test.beforeEach(async ({ page }, testInfo) => {
        // 백엔드는 매 실행마다 빈 in-memory DB로 기동되고 테스트는 병렬 실행되므로,
        // 각 테스트가 고유 이메일로 계정을 직접 등록한 뒤 로그인한다.
        // (동일 이메일을 쓰면 두 번째 테스트부터 중복 등록 409로 실패)
        const email = `tasks-${testInfo.testId}@example.com`;

        await page.goto('/register');
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', 'password123');
        await page.fill('input[name="confirmPassword"]', 'password123');
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');
    });

    test('새 태스크를 생성할 수 있다', async ({ page }) => {
        //Arrange (이미 로그인되어 있음)
        
        //Act
        await page.click('button:has-text("새 태스크 추가")');

        //모달에서 폼 작성
        await page.fill('input[name="taskTitle"]', '새 태스크');
        await page.fill('textarea[name="taskDescription"]', '태스크 설명');
        await page.click('button[type="submit"]');

        //Assert
        await expect(page.locator('.task-item:has-text("새 태스크")')).toBeVisible();
    })

    test('태스크 상태를 변경할 수 있다', async ({ page }) => {
        //Arrange
        // 태스크 먼저 생성
        await page.click('button:has-text("새 태스크 추가")');
        await page.fill('input[name="taskTitle"]', '상태 변경 테스트');
        await page.fill('textarea[name="taskDescription"]', '상태 변경 테스트입니다.');
        await page.click('button[type="submit"]');

        // 방금 생성한 태스크 행으로 스코프를 한정 (다른 태스크의 pending 버튼을 건드리지 않도록)
        const row = page.locator('.task-item:has-text("상태 변경 테스트")');
        await expect(row).toBeVisible();

        //Act
        // 상태 드롭다운을 열고 '진행중' 선택
        await row.locator('[data-testid="status-pending"]').click();
        await page.click('text=진행중');

        //Assert
        // 해당 태스크의 상태가 '진행중'으로 변경되었는지 확인
        await expect(row.locator('[data-testid="status-in_progress"]')).toHaveText('진행중');
    })

    test('태스크를 삭제할 수 있다', async ({ page }) => {
        //Arrange
        // 태스크 먼저 생성
        await page.click('button:has-text("새 태스크 추가")');
        await page.fill('input[name="taskTitle"]', '삭제할 테스트');
        await page.fill('textarea[name="taskDescription"]', '삭제 테스트입니다.');
        await page.click('button[type="submit"]');

        //태스크가 목록에 있는지 확인
        const taskItem = page.locator('.task-item:has-text("삭제할 테스트")');
        await expect(taskItem).toBeVisible();

        //Act
        await taskItem.locator('[data-testid="delete-button"]').click(); // 해당 태스크의 삭제 버튼 클릭
        //확인 다이얼로그
        await page.click('button:has-text("확인")');

        //Assert
        await expect(page.locator('.task-item:has-text("삭제할 테스트")')).toHaveCount(0); // 삭제된 태스크가 목록에 없어야 함
    })

})
