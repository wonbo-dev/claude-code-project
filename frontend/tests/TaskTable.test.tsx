import {render, screen, fireEvent} from '@testing-library/react';
import {describe, test, expect, vi} from 'vitest';
import TaskTable from '../src/components/TaskTable';

describe('TaskTable Component', () => {
    const mockTasks = [
        { id: 1, title: 'Task 1', status: 'pending', description: '설명 1' },
        { id: 2, title: 'Task 2', status: 'completed', description: '설명 2' },
    ];
    test('태스크 목록을 테이블로 렌더링한다', () => {
        // Arrange
        render(<TaskTable tasks={mockTasks} onStatusChange={vi.fn()} onDeleteTask={vi.fn()} />);
        // Act (없음)

        // Assert
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
        expect(screen.getByText('pending')).toBeInTheDocument();
        expect(screen.getByText('completed')).toBeInTheDocument();
    });

    test('상태 변경 버튼 클릭 시 onStatusChange 콜백을 호출한다', () => {
        // Arrange
        const mockOnStatusChange = vi.fn();
        render(<TaskTable tasks={mockTasks} onStatusChange={mockOnStatusChange} onDeleteTask={vi.fn()} />);

        // Act
        const statusButton = screen.getAllByRole('button', { name: '상태 변경' })[0];
        fireEvent.click(statusButton);

        // Assert
        expect(mockOnStatusChange).toHaveBeenCalledWith(1, 'in_progress'); // 첫 번째 태스크의 상태를 'in_progress'로 변경한다고 가정
    });

    test('삭제 버튼 클릭 시 onDeleteTask 콜백을 호출한다', () => {
        // Arrange
        const mockOnDeleteTask = vi.fn();
        render(<TaskTable tasks={mockTasks} onStatusChange={vi.fn()} onDeleteTask={mockOnDeleteTask} />);

        // Act
        const deleteButton = screen.getAllByRole('button', { name: '삭제' })[0];
        fireEvent.click(deleteButton);

        // Assert
        expect(mockOnDeleteTask).toHaveBeenCalledWith(1); // 첫 번째 태스크를 삭제한다고 가정   
    });
});